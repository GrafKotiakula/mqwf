import React from 'react'
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

const LabeledInput = ({label, name, type='text', onChange, error, value, autoComplete='off', placeHolder: placeholder=''}) => {
  return (
    <div className={styles['labeled-input']}>
      <div>
        {label && <label className={styles['input-label']}>{label}</label>}
        {error && <label className={`${styles['input-error']} invisible-scroll`}>{error}</label>}
      </div>
      <input name={name} type={type} 
        value={value} onChange={buildOnSubmit(onChange)}
        autoComplete={autoComplete} placeholder={placeholder}
      />
    </div>
  )
}

export default LabeledInput