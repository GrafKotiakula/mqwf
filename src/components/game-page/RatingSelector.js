import React, { useState } from 'react'
import Rating from '@mui/material/Rating'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare as faSquareSolid } from '@fortawesome/free-solid-svg-icons'
import { faSquare as faSquareRegular } from '@fortawesome/free-regular-svg-icons'

import styles from './RatingSelector.module.css'

const buildGetDesc = func => {
  if(typeof func === 'function') {
    return v => <>{func(v)}<label className={styles['sd-mark']}>{v}</label>/10</>
  } else {
    return v => <><label className={styles['sd-mark']}>{v}</label>/10</>
  }
}

const buildStyleSelector = func => {
  if(typeof func === 'function') {
    return v => func(v)
  } else {
    return () => undefined
  }
}

const RatingSelector = ({value, onChange, name, className='', styleSelector, getDesc}) => {
  const [hover, setHover] = useState(-1)
  
  const _getDesc = buildGetDesc(getDesc)
  const _styleSelector = buildStyleSelector(styleSelector)

  const curValue = hover > 0 ? hover : value
  const iconStyle = `${styles['mui-ic']} ${_styleSelector(curValue)}`

  return (
    <div className={`${styles['selector-container']} ${className}`}>
      <label className={styles['selector-name']}>{name}</label>
      <div className={styles['selector-wrapper']}>
        <Rating
          max={10}
          icon={     <FontAwesomeIcon icon={faSquareSolid}   size='1x' className={styles['icon']}/>}
          emptyIcon={<FontAwesomeIcon icon={faSquareRegular} size='1x' className={styles['icon']}/>}
          value={value}
          onChange={onChange ? (_, v) => onChange(v) : undefined}
          onChangeActive={(_, h) => setHover(h)}
          classes={{
            iconFilled: iconStyle,
            iconHover: iconStyle
          }}
        />
      </div>
      <label className={styles['selector-description']}>
        {_getDesc(curValue)}
      </label>
    </div>
  )
}

export default RatingSelector