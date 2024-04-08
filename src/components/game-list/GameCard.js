import React from 'react'
import { useNavigate } from 'react-router-dom'

import GRImage from '../_common/GRImage'
import { getMainRatingDesc, positiveStyleSelector } from '../../utils/dataUtils'

import styles from './GameCard.module.css'

const GameCard = ({game, className}) => {
  const navigate = useNavigate()
  const {id='ID', name='NAME', image} = game
  const rating = game.avgRating.mainRating
  const description = getMainRatingDesc(rating)
  const ratingClass = positiveStyleSelector(rating)
  return (
    <div className={`${className} ${styles['game-card']}`} title={name} onClick={e => {e.stopPropagation(); navigate(`/game/${id}`)}}>
      <GRImage image={image}/>
      <label className={styles['game-card-name']}>{name}</label>
      <div className={styles['game-card-rating']}>
        <span className={`${styles['game-card-rating-mark']} ${ratingClass}`}>{rating}</span>
        <label className={styles['game-card-rating-description']}>{description}</label>
      </div>
    </div>
  )
}

export default GameCard