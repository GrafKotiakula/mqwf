import React from 'react'
import styles from './GRDataLoader.module.css'

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

const GRDataLoader = ({text = 'Loading...', error, isLoaded, children, className='', loadedClassName=''}) => {
  
  if(isLoaded) {
    return (
      <div className={`${className} ${loadedClassName} ${styles['loader-container']}`}>
        {children}
      </div>
    )
  } else {
    const textToDisplay = error ? getDesc(error) : text
    return (
      <div className={`${className} ${styles['loader-container']} ${styles['loader-not-loaded']}`}>
        {error && <label className={styles['err-code']}>{error}</label>}
        <label className={styles['loader-text']}>{textToDisplay}</label>
      </div>
    )
  }
}

export default GRDataLoader