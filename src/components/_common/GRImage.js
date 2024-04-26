import React from 'react'
import { imageSource } from "../../api/imageRestApi"
import styles from './GRImage.module.css'

const GRImage = ({image, className='', isStatic = false}) => {
  const imgSrc = isStatic ? image : imageSource(image)
  const alt = isStatic? image : image?.alternate
  return (
    <div className={`${className} ${styles['image']}`}>
      { image && 
        <img src={imgSrc} alt={alt}/>
      }
    </div>
  )
}

export default GRImage