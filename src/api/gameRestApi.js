import { isNotEmptyString } from "../utils/varUtils";
import { __timestampFormat, __get } from "./_restApi";

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
