import React from 'react'
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

const LabeldSelector = ({label, options, value, onChange}) => {
  return (
    <div className={styles['labeled-input']}>
      {label && <label className={styles['input-label']}>{label}</label>}
      <select value={value} onChange={wrapCallback(onChange)}>
        {isNotEmptyArray(options) && [...new Set(options)].map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

export default LabeldSelector