import React from 'react'

import { getValueOrDefault, isDefined } from '../../utils/varUtils'
import { imageSource } from '../../utils/restApi'

import styles from './GRImage.module.css'

const GRImage = ({image, className, isStatic = false}) => {
  const imgSrc = isStatic ? image?.name : imageSource(image)
  return (
    <div className={`${className} ${styles['image']}`}>
      { isDefined(image) && 
        <img src={imgSrc} alt={getValueOrDefault(image.alternate, 'alt')}/>
      }
    </div>
  )
}

export default GRImage