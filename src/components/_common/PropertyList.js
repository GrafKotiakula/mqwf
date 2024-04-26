import React, { Fragment } from 'react'
import { isNotEmptyObject } from '../../utils/varUtils'
import styles from './PropertyList.module.css'

const PropertyList = ({values, className}) => {
  if(isNotEmptyObject(values)) {
    return (
      <div className={`${className} ${styles['property-list']}`}>
        {Object.entries(values).map(([key, value]) => (
          <Fragment key={key}>
            <label className={styles['property-name']}>
              {key}
            </label>
            <span className={`${styles['property-value']} invisible-scroll`}>
              {value}
            </span>
          </Fragment>
        ))}
      </div>
    )
  }
}

export default PropertyList