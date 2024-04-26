import { __timestampFormat, __get, __authenticatedRequest } from "./_restApi";

import { parse } from "date-fns";



export const Role = Object.freeze({
    user: "USER", moderator: "MODERATOR", admin: "ADMIN"
})

export const Status = Object.freeze({
    enabled: 'ENABLED',
    locked: 'LOCKED',
    disabled: 'DISABLED',
})

export const __parseUserJSON = user => ({
    ...user,
    created: user.created ? parse(user.created, __timestampFormat, new Date()) : null,
    expiration: user.expiration ? parse(user.expiration, __timestampFormat, new Date()) : null,
    credentialsExpiration: user.credentialsExpiration ? parse(user.credentialsExpiration, __timestampFormat, new Date()) : null,
})

const parseUserResponse = response => {
    const { status, json } = response
    if (status === 200) {
        response.json = __parseUserJSON(json)
    }
    return Promise.resolve(response)
}

const buildBaseUserUpdateUrl = id => id ? `/data/user/${id}` : '/data/user'



export const getUserById = id => {
    if (!id) {
        return Promise.reject(new Error('id is not defined'))
    } else {
        return __get(`/data/user/${id}`)
        .then(parseUserResponse)
    }
}

export const updateUser = (user, login, id) => {
    if (!user) {
        return Promise.reject(new Error('user is not defined'))
    }
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = buildBaseUserUpdateUrl(id)
    return __authenticatedRequest(uri, login, {
        options: {
            method: 'PUT',
            body: JSON.stringify(user)
        }
    })
    .then(parseUserResponse)
}

export const updateUserPassword = (password, login, id) => {
    if (!password) {
        return Promise.reject(new Error('password is not defined'))
    }
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = `${buildBaseUserUpdateUrl(id)}/password`
    return __authenticatedRequest(uri, login, {
        options: {
            method: 'PUT',
            body: JSON.stringify({password})
        }
    })
    .then(parseUserResponse)
}

export const updateUserImage = (file, login, id) => {
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = `${buildBaseUserUpdateUrl(id)}/image`
    const method = file ? 'PUT' : 'DELETE'
    const formData = new FormData()
    if(file) {
        formData.append('image', file)
    }

    return __authenticatedRequest(uri, login, {
        options: {
            method: method,
            headers: { 'Content-Type': 'multipart/form-data' },
            body: formData
        }
    }).then(parseUserResponse)
}

export const updateUserRole = (id, role, login) => {
    if (!id) {
        return Promise.reject(new Error('id is not defined'))
    }
    if (!Object.values(Role).includes(role)) {
        return Promise.reject(new Error('role is invalid'))
    }
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = `/data/user/${id}/role`
    return __authenticatedRequest(uri, login, {
        options: {
            method: 'PUT',
            body: JSON.stringify({role})
        }
    }).then(parseUserResponse)
}

export const blockUser = (id, login) => {
    if (!id) {
        return Promise.reject(new Error('id is not defined'))
    }
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = `/data/user/${id}/block`
    return __authenticatedRequest(uri, login, {
        options: { method: 'PUT' }
    })
    .then(parseUserResponse)
}

export const unblockUser = (id, login) => {
    if (!id) {
        return Promise.reject(new Error('id is not defined'))
    }
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = `/data/user/${id}/unblock`
    return __authenticatedRequest(uri, login, {
        options: { method: 'PUT' }
    })
    .then(parseUserResponse)
}

