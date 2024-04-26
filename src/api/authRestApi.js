import { isNotEmptyString } from "../utils/varUtils";
import { __baseUrl, __jsonFetch } from "./_restApi";

const jwtTokenExpiration = 3600000 // 1 hour

export const login = (username, password) => {
    if (!username) {
        return Promise.reject(new Error('Username is not defined'))
    } else if (!password) {
        return Promise.reject(new Error('Password is not defined'))
    } else {
        const url = `${__baseUrl}/auth/login`
        return __jsonFetch(url, {
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
            if (response.status === 200) {
                if (!response.json?.token) {
                    console.error(`${url}: JWT token is not defined`)
                    response.status === 601
                    response.statusText === 'Invalid Response'
                }
                if (!response.json?.user) {
                    console.error(`${url}: user is not defined`)
                    response.status === 601
                    response.statusText === 'Invalid Response'
                }
            }
            return Promise.resolve(response)
        })
    }
}

export const signup = async (username, password) => {
    if (!username) {
        return Promise.reject(new Error('Username is not defined'))
    }
    if (!password) {
        return Promise.reject(new Error('Password is not defined'))
    }

    return __jsonFetch(`${__baseUrl}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
}

export const buildLoginState = ({username = null, password = null, jwtToken = null, user = null, created = Date.now()}) => ({
    user: user,
    credentials: {
        username: username,
        password: password,
        jwtToken: jwtToken,
        created: created
    }
})

export const isLogedin = ({ user, credentials: {jwtToken, created} }) => 
    isNotEmptyString(jwtToken) && user && Date.now() - created < jwtTokenExpiration

export const buildLogoutState = () => buildLoginState({created: new Date(0)})
