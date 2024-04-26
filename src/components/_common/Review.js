import React from 'react'

import GameRatingList from '../game-page/GameRatingList'
import { formattedDate, selectStyle } from '../../utils/dataUtils'

import styles from './Review.module.css'

const defaultHeader = review => (
  <div className={styles['rv-header']}>
    <label >{review.user.username}</label>
    <label >{review.game.name}</label>
    <label >{formattedDate(review.date)}</label>
  </div>
)

const Review = ({review, headerBuilder}) => {
  const mainRating = review.rating.mainRating
  const qualityClassName = selectStyle(mainRating, {
    high: styles['good'],
    mid: styles['avg'], 
    low: styles['bad']
  })
  return (
    <div className={`${styles['rv-container']} ${qualityClassName}`}>
      { typeof headerBuilder === 'function' ? headerBuilder(review) : defaultHeader(review) }
      <div className={styles['rv-content']}>
        <GameRatingList ratings={review.rating} name='Marks' grouped={false} className={styles['rv-marks-collapsible']}/>
        <p className={styles['rv-review']}>{review.text}</p>
      </div>
    </div>
  )
}

export default Review