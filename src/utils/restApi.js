import { parse } from "date-fns"
import { getValueOrDefault, isDefined, isNotEmptyString } from "./varUtils"

export const ErrCode = Object.freeze({
    JWT_EXPIRED: 1000,
    JWT_INVALID: 1001,
    WRONG_USERNAME_OR_PASSWORD: 1002,
    ENTOTY_NOT_FOUND: 1301,
    REVIEW_BY_GAME_AND_USER_NOT_FOUND: 1302,
    DUPLICATED_FIELD: 1407,
})

const protocol = 'http'
const host = 'localhost'
const port = '7070'
const contextPath = '/api'
const baseUrl = `${protocol}://${host}:${port}${contextPath}`

const timestampFormat = 'yyyy-MM-dd HH:mm:ss XXXX'

const buildPrettyResponse = ({
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

const convertResponse = async (response, convertToJson = true) => {
    let result = buildPrettyResponse({
        status: response?.status,
        statusText: response?.statusText,
        type: response?.type,
        url: response?.url
    })
    if(response && convertToJson && response.status < 600) {
        await response.json().then(json => {
            result.json = json
        })
        .catch(error => {
            console.error(`Cannot parse to JSON ${response.url}`, {response, error})
            if(response.status >= 200 && response.status < 300) {
                result.status = 601
            }
        })
    }
    return result
}

const wrapedFetch = (url, options) => {
    return fetch(url, options)
    .catch(error => {
        console.error(url, error)
        return Promise.resolve( buildPrettyResponse({url: url, status: 600, statusText: 'Network Error'}) )
    })
}

const jsonFetch = (url, options) => {
    if(!options) {
        options = {}
    }
    if(!options.headers){
        options.headers = {}
    }
    options.headers['Content-Type'] = 'application/json'
    return wrapedFetch(url, options)
    .then(response => convertResponse(response))
}

const authFetch = (url, options, jwtToken) => {
    if(!options) {
        options = {}
    }
    if(!options.headers){
        options.headers = {}
    }
    options.headers['Authorization'] = jwtToken
    return jsonFetch(url, options)
}

export const login = (username, password) => {
    if(!username) {
        return Promise.reject(new Error('Username is not defined'))
    } else if(!password) {
        return Promise.reject(new Error('Password is not defined'))
    } else {
        const url = `${baseUrl}/auth/login`
        return jsonFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if(response.status === 200) {
                if(!response.json?.token){
                    console.error(`${url}: JWT token is not defined`)
                    response.status === 601
                    response.statusText === 'Invalid Response'
                }
                if(!response.json?.user) {
                    console.error(`${url}: user is not defined`)
                    response.status === 601
                    response.statusText === 'Invalid Response'
                }
            }
            return Promise.resolve(response)
        })
    }
}

const buildUrl = (uri, queryParams) => {
    let url = baseUrl + uri
    if(queryParams && Object.keys(queryParams).length !== 0 ) {
        url += `?${new URLSearchParams(queryParams)}`
    }
    return url
}

const authenticatedRequest = async (uri, {credentials}, {options, params}) => {
    const url = buildUrl(uri, params?.queryParams)
    const {username, password} = credentials
    let {jwtToken} = credentials
    let newLogin = null

    if(!isNotEmptyString(jwtToken)){
        const {status} = await login(username, password)
        if( status >= 400 ) { // authentication failed
            return Promise.reject(new Error('Cannot authenticate'))
        }
    }
    let response = await authFetch(url, options, jwtToken)
    if(response.status === 401) {
        if (response.json.code === ErrCode.JWT_EXPIRED || response.json.code === ErrCode.JWT_INVALID) {
            const {json: {token: newJwtToken}, user: newUser, status} = await login(username, password)
            if(status >= 400) { // if authentication failed
                return Promise.reject(new Error('Cannot authenticate'))
            } else {
                response = await authFetch(url, options, jwtToken)
                newLogin = {
                    credentials: {...credentials, jwtToken: newJwtToken},
                    user: newUser
                }
            }
        }
    }
    return {...response, newLogin}
}

export const buildLoginState = (username, password, jwtToken, user) => ({
    user: user, 
    credentials: {
        username: username, 
        password: password, 
        jwtToken: jwtToken
    }
})

export const signup = async (username, password) => {
    if(!username) {
        return Promise.reject(new Error('Username is not defined'))
    }
    if(!password) {
        return Promise.reject(new Error('Password is not defined'))
    }

    return jsonFetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
}

export const isLogedin = ({user, credentials}) => isNotEmptyString(credentials?.jwtToken) && isDefined(user)

export const logoutState = {user: null, credentials: {username: null, password: null, jwtToken: null}}

export const imageSource = (image) => `${baseUrl}/data/image/${image?.id}/download`

const get = (uri, props={}) => {
    const {queryParams} = props
    const url = buildUrl(uri, queryParams)
    return jsonFetch(url, { method: 'GET' })
}

const parseGameResponse = (game) => {
    game.release = parse(game.release, timestampFormat, new Date())
    return game
}

const parseReviewResponse = (review) => {
    review.game = parseGameResponse(review.game)
    return review
}

export const getAllGames = (page) => get('/data/game/all', {queryParams: {page: page}})
.then(response => {
    const {status, json} = response
    if(status === 200) {
        response.json.content = json.content.map(g => parseGameResponse(g))
    }
    return Promise.resolve(response)
})

export const getGameById = (id) => get(`/data/game/${id}`)
.then(response => {
    const {status, json} = response
    if(status === 200) {
        response.json = parseGameResponse(json)
    }
    return Promise.resolve(response)
})

export const findAllReviewsByGame = (gameId, page) => get(`/data/review/game/${gameId}/all`, {queryParams: {page: page}})
.then(response => {
    const {status, json} = response
    if(status === 200) {
        response.json.content = json.content.map(r => parseReviewResponse(r))
    }
    return Promise.resolve(response)
})

export const findReviewByGameAndAuth = (gameId, login) => authenticatedRequest(
    `/data/review/game/${gameId}/my`, login, {
        options: { method:'GET' }
    })
.then(response => {
    const {json, status} = response
    if(status === 200) {
        response.json = parseReviewResponse(json)
    }
    return Promise.resolve(response)
})

export const saveReview = (review, login) => {
    if(!review) {
        return Promise.reject(new Error('Review is not defined'))
    }
    if(!login) {
        return Promise.reject(new Error('Login is not defined'))
    }
    const id = review.id
    const [uri, method] = isNotEmptyString(id) ? [`/data/review/${id}`, 'PUT'] : ['/data/review', 'POST']
    return authenticatedRequest(uri, login, {
        options: {
            method: method,
            body: JSON.stringify(review),
        },
    })
}
