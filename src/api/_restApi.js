import { isNotEmptyString, isNotEmptyObject } from "../utils/varUtils"
import { login } from "./authRestApi"
import ErrorCode from "./ErrorCode"

const protocol = 'http'
const host = 'localhost'
const port = '7070'
const contextPath = '/api'

export const __baseUrl = `${protocol}://${host}:${port}${contextPath}`

export const __timestampFormat = 'yyyy-MM-dd HH:mm:ss XXXX'

const __buildUrl = (uri, queryParams) => {
    let url = __baseUrl + uri
    if(isNotEmptyObject(queryParams)) {
        url += `?${new URLSearchParams(queryParams)}`
    }
    return url
}

const __buildPrettyResponse = ({
    status = null,
    statusText = null,
    type = null,
    url = null,
    json = null
}) => ({
    status: status,
    statusText: statusText,
    type: type,
    url: url,
    json: json
})

const __convertResponse = async (response, convertToJson = true) => {
    const result = __buildPrettyResponse({
        status: response?.status,
        statusText: response?.statusText,
        type: response?.type,
        url: response?.url
    })
    if(response && convertToJson && response.status < 600) {
        await response.json().then(json => result.json = json)
        .catch(error => {
            console.error(`Cannot parse to JSON ${response.url}`, {response, error})
        })
    }
    return result
}

const __wrapedFetch = (url, options) => {
    return fetch(url, options)
    .catch(error => {
        console.error(url, '\n', error)
        if(error?.message?.startsWith('NetworkError')) {
            return Promise.resolve( __buildPrettyResponse({url: url, status: 600, statusText: 'Network Error'}) )
        } else {
            return Promise.resolve( __buildPrettyResponse({url: url, status: 601, statusText: 'Unknown Fetch Error'}) )
        }
    })
}

const __addHeadersObjectIfNeedAbsent = options => {
    if(!options) {
        options = {}
    }
    if(!options.headers){
        options.headers = {}
    }
    return options
}

const __addHeaderIfAbsent = (options, header, value) => {
    if(!options.headers[header]) {
        options.headers[header] = value
    }
}

export const __jsonFetch = (url, options) => {
    options = __addHeadersObjectIfNeedAbsent(options)
    __addHeaderIfAbsent(options, 'Accept', 'application/json')
    __addHeaderIfAbsent(options, 'Content-Type', 'application/json')
    if(options.headers['Content-Type'] === 'multipart/form-data') {
        delete options.headers['Content-Type']
    }
    return __wrapedFetch(url, options)
    .then(__convertResponse)
}

const __authFetch = (url, options, jwtToken) => {
    if(!options) {
        options = {}
    }
    if(!options.headers){
        options.headers = {}
    }
    options.headers['Authorization'] = jwtToken
    return __jsonFetch(url, options)
}

export const __authenticatedRequest = async (uri, {credentials}, {options, queryParams}) => {
    const url = __buildUrl(uri, queryParams)
    const {username, password} = credentials
    let {jwtToken} = credentials
    let newLogin = null

    if(!isNotEmptyString(jwtToken)){
        const {status} = await login(username, password)
        if( status >= 400 ) { // authentication failed
            return Promise.reject(new Error('Cannot authenticate'))
        }
    }
    let response = await __authFetch(url, options, jwtToken)
    if(response.status === 401) {
        if (response.json.code === ErrorCode.JWT_EXPIRED || response.json.code === ErrorCode.JWT_INVALID) {
            const {json: {token: newJwtToken}, user: newUser, status} = await login(username, password)
            if(status >= 400) { // authentication failed
                return Promise.reject(new Error('Cannot authenticate'))
            } else {
                response = await __authFetch(url, options, jwtToken)
                newLogin = {
                    credentials: {...credentials, jwtToken: newJwtToken},
                    user: newUser
                }
            }
        }
    }
    return {...response, newLogin}
}

export const __get = (uri, queryParams={}) => {
    const url = __buildUrl(uri, queryParams)
    return __jsonFetch(url, { method: 'GET' })
}
