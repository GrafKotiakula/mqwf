import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { isNotEmptyArray } from '../../utils/varUtils'

import styles from './LabeledSelector.module.css'

const wrapCallback = (callBack) => {
  if(typeof callBack === 'function') {
    return ({target}) => {
      callBack(target.value)
    }
  } else {
    return undefined
  }
}

const LabeledSelector = ({label, options, value, onChange}) => {
  return (
    <div className={styles['labeled-input']}>
      {label && <label className={styles['input-label']}>{label}</label>}
      <div className={styles['select-wrapper']}>
        <select value={value} onChange={wrapCallback(onChange)} className='input'>
          {isNotEmptyArray(options) && [...new Set(options)].map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <FontAwesomeIcon icon={faChevronDown} size='1x' className={styles['select-icon']}/>
      </div>
    </div>
  )
}

export default LabeledSelector