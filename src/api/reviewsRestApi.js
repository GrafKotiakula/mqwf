import { __timestampFormat, __get, __authenticatedRequest } from "./_restApi";

import { parse } from "date-fns";
import { isNotEmptyString } from "../utils/varUtils";
import { __parseGameJSON } from "./gameRestApi";
import { __parseUserJSON } from "./userRestApi";


const parseReviewResponse = review => {
    review.date = review.date ? parse(review.date, __timestampFormat, new Date()) : null
    review.user = review.user ? __parseUserJSON(review.user) : null
    review.game = review.game ? __parseGameJSON(review.game) : null
    return review
}


export const findAllReviewsByGame = (gameId, page) => __get(`/data/review/game/${gameId}/all`, { page: page })
    .then(response => {
        const { status, json } = response
        if (status === 200) {
            response.json.content = json.content.map(r => parseReviewResponse(r))
        }
        return Promise.resolve(response)
    })

export const findAllReviewsByUser = (userId, page) => __get(`/data/review/user/${userId}/all`, { page: page })
    .then(response => {
        const { status, json } = response
        if (status === 200) {
            response.json.content = json.content.map(r => parseReviewResponse(r))
        }
        return Promise.resolve(response)
    })

export const findReviewByGameAndAuth = (gameId, login) => __authenticatedRequest(
    `/data/review/game/${gameId}/my`, login, {
    options: { method: 'GET' }
})
.then(response => {
    const { json, status } = response
    if (status === 200) {
        response.json = parseReviewResponse(json)
    }
    return Promise.resolve(response)
})

export const saveReview = (review, login) => {
    if (!review) {
        return Promise.reject(new Error('Review is not defined'))
    }
    if (!login) {
        return Promise.reject(new Error('Login is not defined'))
    }
    const id = review.id
    const [uri, method] = isNotEmptyString(id) ? [`/data/review/${id}`, 'PUT'] : ['/data/review', 'POST']
    return __authenticatedRequest(uri, login, {
        options: {
            method: method,
            body: JSON.stringify(review),
        },
    })
}
