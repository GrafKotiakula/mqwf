import { getValueOrDefault, isDefined } from "./varUtils"

export const ErrCode = Object.freeze({
    JWT_EXPIRED: 1000,
    JWT_INVALID: 1001,
    WRONG_USERNAME_OR_PASSWORD: 1002
})

class RestApi {
    constructor ({protocol, host, port, contextPath}) {
        this.baseUrl = this._buildBaseUrl({
            protocol: getValueOrDefault(protocol, 'http'),
            host: getValueOrDefault(host, 'localhost'),
            port: getValueOrDefault(port, '8080'),
            contextPath: getValueOrDefault(contextPath, ''),
        })

        this.jwtToken = null
        this.username = null
        this.password = null
    }

    _buildBaseUrl({protocol, host, port, contextPath}){
        return `${protocol}://${host}:${port}${contextPath}`
    }

    async _convertResponse(response, convertToJson = true) {
        let result = {
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            url: response.url
        }
        if(convertToJson) {
            await response.json().then(json => {
                result['json'] = json
            })
            .catch(err => console.error(`Cannot parse to json ${response.url} response:\n${err}`))
        }
        return result
    }

    async _loginRequest() {
        if(!isDefined(this.username)) {
            return Promise.reject(new Error('Username is null'))
        }
        if(!isDefined(this.password)) {
            return Promise.reject(new Error('Password is null'))
        }

        let success = false
        let response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.username,
                password: this.password
            })
        })
        .then(async responce => await this._convertResponse(responce))
        .then(response => {
            if(response.status === 200) {
                if(isDefined(response.json.token)){
                    this.jwtToken = response.json.token
                    success = true
                } else {
                    console.error(`${response.url} response jwt token is null`)
                }
            } else {
                console.error(`${response.url} response status is ${response.status}`)
            }
            return Promise.resolve(response)
        })
        return [response, success]
    }

    async login(username, password) {
        this.username = username
        this.password = password
        let [response] = await this._loginRequest()
        return response
    }

    logout() {
        this.jwtToken = null
        this.username = null
        this.password = null
    }

    isLogedin() {
        return isDefined(this.jwtToken)
    }

    _authFetch(url, options) {
        if(isDefined(this.jwtToken)) {
            if(!isDefined(options.headers)){
                options.headers = {}
            }
            options.headers['Authorization'] = this.jwtToken
        }
        return fetch(url, options)
    }

    async _authenticatedRequest(url, options) {
        if(!isDefined(this.jwtToken)){
            if( !(await this._loginRequest())[1] ) { // if authentication failed
                return Promise.reject(new Error('Authentication failed'))
            }
        }
        let responce = await this._authFetch(url, options)
        if(responce.status === 401) {
            let json = await responce.json()
            if (json.code === ErrCode.JWT_EXPIRED || json.code === ErrCode.JWT_INVALID) {
                this.jwtToken = null
                if( !(await this._loginRequest())[1] ) { // if authentication failed
                    return Promise.reject(new Error('Authentication failed'))
                }
                return this._authFetch(url, options)
            }
        } else {
            return Promise.resolve(responce)
        }
    }

    get(uri, {queryParams, id}, isAnonymous = true) {
        let url = `${this.baseUrl}${uri}`
        if(isDefined(id)) {
            url += `/${id}`
        }
        if(isDefined(queryParams) && Object.keys(queryParams).length !== 0 ) {
            url += `?${new URLSearchParams(queryParams)}`
        }

        const requestFunction = (isAnonymous ? fetch : this._authenticatedRequest)

        return requestFunction(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    create(uri, object) {
        return this._authenticatedRequest(`${this.baseUrl}${uri}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object)
        })
    }
}

export const api = new RestApi({
    protcol: 'http', 
    host: 'localhost', 
    port: '7070', 
    contextPath: '/api'
})
