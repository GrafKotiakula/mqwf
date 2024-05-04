import { format } from "date-fns-tz";
import { isNotEmptyString } from "../utils/varUtils";
import { __timestampFormat, __get, __authenticatedRequest } from "./_restApi";

import { parse } from "date-fns";

export const __parseGameJSON = (game) => {
    game.release = parse(game.release, __timestampFormat, new Date())
    return game
}

const parseGameResponse = response => {
    const { status, json } = response
    if (status === 200) {
        response.json = __parseGameJSON(json)
    }
    return Promise.resolve(response)
}

const parseGameListResponse = response => {
    const { status, json } = response
    if (status === 200) {
        response.json.content = json.content.map(g => __parseGameJSON(g))
    }
    return Promise.resolve(response)
}

const parseGameToJSON = game => {
    if(!game) {
        return '{}'
    }
    return JSON.stringify({
        name: game.name,
        release: `${format(game.release, 'yyyy-MM-dd')} 00:00:00 +0000`, // TODO: fix unknown bug with time zones
        developerId: game.developer?.id || null,
        publisherId: game.publisher?.id || null,
    })
}


export const getAllGames = page => __get('/data/game/all', { page: page })
    .then(parseGameListResponse)

export const findGamesByName = (name, page) => __get('/data/game/find-by/name', { page: page, filter: name })
    .then(parseGameListResponse)

export const findGamesByOptionalName = (name, page) => {
    if(isNotEmptyString(name)) {
        return findGamesByName(name, page)
    } else {
        return getAllGames(page)
    }
}

export const getGameById = (id) => __get(`/data/game/${id}`)
    .then(parseGameResponse)

export const createGame = (game, login) => {
    if(!game) {
        return Promise.reject(new Error('game is not defined'))
    }
    if(!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    return __authenticatedRequest('/data/game', login, {
        options:{ method:'POST', body: parseGameToJSON(game) }
    })
}

export const updateGame = (game, login) => {
    if(!game) {
        return Promise.reject(new Error('game is not defined'))
    }
    if(!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    return __authenticatedRequest(`/data/game/${game?.id}`, login, {
        options:{ method:'PUT', body: parseGameToJSON(game) }
    })
}

export const updateGameImage = (file, login, id) => {
    if (!login) {
        return Promise.reject(new Error('login is not defined'))
    }
    const uri = `/data/game/${id}/image`
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
    }).then(parseGameResponse)
}
