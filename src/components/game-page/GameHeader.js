import React from 'react'

import GRImage from '../_common/GRImage'
import PropertyList from '../_common/PropertyList'
import { formattedDate, getMainRatingDesc, positiveStyleSelector } from '../../utils/dataUtils'

import styles from './GameHeader.module.css'

const GameHeader = ({game}) => {
  const {name, image, developer, publisher, avgRating, release} = game
  const rating = avgRating?.mainRating?.toFixed(1)
  
  return (
    <div className={styles['game-header']}>
      <GRImage image={image} className={styles['game-img']}/>
      <div className={styles['game-descriptions']}>
        <label className={styles['gd-name']}>{name}</label>
        <PropertyList values={{
          Release: formattedDate(release),
          Developer: developer?.name,
          Publisher: publisher?.name,
        }}/>
        <div className={styles['gd-rating']}>
          <span className={`${styles['gd-rating-mark']} ${positiveStyleSelector(rating)}`}>
            {rating}
          </span>
          <label className={styles['gd-rating-description']}>
            {getMainRatingDesc(rating)}
          </label>
        </div>
      </div>
    </div>
  )
}

export default GameHeader