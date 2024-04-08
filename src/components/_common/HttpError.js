import React from 'react'
import styles from './HttpError.module.css'

const getDesc = error => {
    switch (error){
        case 400: return 'Bad Request'
        case 401: return 'Unauthorized'
        case 403: return 'Forbidden'
        case 404: return 'Not Found'
        case 422: return 'Unprocessable Entity'
        case 500: return 'Internal Server Error'
        case 507: return 'Insufficient Storage'
        case 600: return 'Network Error'
        case 601: return 'Invalid Response'
        default: return 'Unknown Error'
    }
}

const HttpError = ({error}) => {
  return (
    <div className={styles['err-bg']}>
        <label className={styles['err-code']}>{error}</label>
        <label className={styles['err-text']}>{getDesc(error)}</label>
    </div>
  )
}

export default HttpError