import React from 'react'
import { isDefined } from '../../utils/varUtils'
import styles from './LabeledInput.module.css'

const buildOnSubmit = (callBack) => {
  if(typeof callBack === 'function') {
    return (event) => {
      event.preventDefault()
      callBack(event.target.value)
    }
  } else {
    return undefined
  }
}

const LabeledInput = ({label, name, type='text', onChange, error, value, autoComplete='off'}) => {
  return (
    <div className={styles['labeled-input']}>
      <div>
        {isDefined(label) && <label className={styles['input-label']}>{label}</label>}
        {isDefined(error) && <label className={`${styles['input-error']} invisible-scroll`}>{error}</label>}
      </div>
      <input name={name} type={type} onChange={buildOnSubmit(onChange)} autoComplete={autoComplete} value={value}/>
    </div>
  )
}

export default LabeledInput