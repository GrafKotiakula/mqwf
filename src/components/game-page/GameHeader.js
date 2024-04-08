import React from 'react'
import GRImage from '../_common/GRImage'
import styles from './GameHeader.module.css'
import { formattedString, getMainRatingDesc, positiveStyleSelector } from '../../utils/dataUtils'

const defaultText = 'Loading...'

const GameHeader = ({game}) => {
  const {
    name = defaultText,
    image = null,
    developer: {
      name: developerName = defaultText
    } = {},
    publisher: {
      name: publisherName = defaultText
    } = {},
    avgRating: {
      mainRating = 0
    } = {}
  } = game ? game : {}
  const releaseText = game ? formattedString(game.release) : defaultText
  const rating = mainRating.toFixed(1)
  const ratingClass = positiveStyleSelector(rating)
  const description = getMainRatingDesc(rating)
  return (
    <div className={styles['game-header']}>
      <GRImage image={image} className={styles['game-img']}/>
      <div className={styles['game-descriptions']}>
        <label className={styles['gd-name']}>{name}</label>
        <div className={styles['gd-props']}>
          <label>Release</label> <label>{releaseText}</label>
          <label>Developer</label> <label>{developerName}</label>
          <label>Publisher</label> <label>{publisherName}</label>
        </div>
        <div className={styles['gd-rating']}>
          <span className={`${styles['gd-rating-mark']} ${ratingClass}`}>{rating}</span>
          <label className={styles['gd-rating-description']}>{description}</label>
        </div>
      </div>
    </div>
  )
}

export default GameHeader