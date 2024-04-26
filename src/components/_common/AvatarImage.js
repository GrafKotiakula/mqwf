import React from 'react'
import GRImage from './GRImage'
import styles from './AvatarImage.module.css'

const AvatarImage = ({className='', ...rest}) => <GRImage className={`${className} ${styles['avatar']}`} {...rest}/>

export default AvatarImage