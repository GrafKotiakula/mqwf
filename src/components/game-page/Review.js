import React from 'react'
import GRImage from '../_common/GRImage'

import GameRatingList from './GameRatingList'

import { formattedString, selectStyle } from '../../utils/dataUtils'
import styles from './Review.module.css'

const Review = ({review}) => {
  const mainRating = review.rating.mainRating
  const qualityClassName = selectStyle(mainRating, {
    high: styles['good'],
    mid: styles['avg'], 
    low: styles['bad']
  })
  return (
    <div className={`${styles['rv-container']} ${qualityClassName}`}>
      <div className={styles['rv-header']}>
        <GRImage image={review.user.image} className={styles['rv-header-image']} />
        <label className={styles['rv-header-username']}>{review.user.username}</label>
        <label className={styles['rv-header-date']}>{formattedString(review.date)}</label>
      </div>
      <div className={styles['rv-content']}>
        <GameRatingList ratings={review.rating} name='Marks' grouped={false} className={styles['rv-marks-collapsible']}/>
        <p className={styles['rv-review']}>{review.text}</p>
      </div>
    </div>
  )
}

export default Review