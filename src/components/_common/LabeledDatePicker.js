import React from 'react'
import DatePicker from 'react-datepicker'

import styles from './LabeledDatePicker.module.css'

const LabeledDatePicker = ({label, error, value, onChange, dateFormat='d MMM yyyy'}) => {
  return (
    <div className={styles['labeled-input']}>
      <div>
        {label && <label className={styles['input-label']}>{label}</label>}
        {error && <label className={`${styles['input-error']} invisible-scroll`}>{error}</label>}
      </div>
      <DatePicker dateFormat={dateFormat} selected={value} onChange={onChange}/>
    </div>
  )
}

export default LabeledDatePicker