import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import styles from './Popup.module.css'

function Popup({show, children, onClose}) {
  return show ? (
    <div className={`${styles['popup-bg']} invisible-scroll`} onClick={onClose}>
        <div className={styles['popup-body']} onClick={e => {e.stopPropagation()}}>
            <button className={styles['popup-close-button']} onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} size='1x'/>
            </button>
            <div className={styles['popup-content']}>
              {children}
            </div>
        </div>
    </div>
  ) : ''
}

export default Popup