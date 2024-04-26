import { useState } from "react"
import { buildLoginState, buildLogoutState, isLogedin } from "../api/authRestApi"

const loginItemName = 'login'

const saveLocalLogin = ({user, credentials: {jwtToken, created}}) => 
    localStorage.setItem(loginItemName, JSON.stringify({ user, jwtToken, created }))

const getLocalLogin = () => {
    const savedLogin = JSON.parse(localStorage.getItem(loginItemName)) || {}
    const login = buildLoginState(savedLogin)
    
    if(isLogedin(login)) {
        return login
    } else {
        return buildLogoutState()
    }
}

export const useLocalLogin = () => {
    const [state, setState] = useState(getLocalLogin)
    
    const setLogin = login => {
        saveLocalLogin(login)
        setState(login)
    }

    return [state, setLogin]
}

