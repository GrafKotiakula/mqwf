import React from 'react'
import styles from './Overlappable.module.css'

const Overlappable = ({className='', text='Loading...', showOverlap=true, children}) => {
  return (
    <div className={`${className} ${styles['overlap-container']}`}>
      {showOverlap && (
        <div className={styles['overlap-bg']}>
          <label className={styles['overlap-text']}>{text}</label>
        </div>
      )}
      {children}
    </div>
  )
}

export default Overlappable