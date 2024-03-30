import React from 'react'
import { useNavigate } from 'react-router-dom'

import { isDefined } from '../../utils/varUtils'

import styles from './GameCard.module.css'

const selectDescritionAndClass = (rating) => {
     if (rating === 0) { return {description: 'Unmarked yet',  ratingClass: styles['unmarked']} }
  else if (rating > 9) { return {description: 'Outstanding',   ratingClass: styles['good']} }
  else if (rating > 8) { return {description: 'Excellent',     ratingClass: styles['good']} }
  else if (rating > 7) { return {description: 'Good',          ratingClass: styles['good']} }
  else if (rating > 6) { return {description: 'Okay',          ratingClass: styles['average']} }
  else if (rating > 5) { return {description: 'Average',       ratingClass: styles['average']} }
  else if (rating > 4) { return {description: 'Below Average', ratingClass: styles['average']} }
  else if (rating > 3) { return {description: 'Poor',          ratingClass: styles['bad']} }
  else if (rating > 2) { return {description: 'Awful',         ratingClass: styles['bad']} } 
  else/* from 0 to 2 */{ return {description: 'Terrible',      ratingClass: styles['bad']} }
}


const GameCard = ({game, placeholder='GR MQWF', className}) => {
  const navigate = useNavigate()
  const {id='ID', name='NAME', image={name: '', alternate: 'image'}} = game
  const rating = game.avgRating.mainRating
  const {description, ratingClass} = selectDescritionAndClass(rating)
  return (
    <div className={`${className} ${styles['game-card']}`} title={name} onClick={e => {e.stopPropagation(); navigate(`/game/${id}`)}}>
      <div className={styles['game-card-image']}>
        {
          isDefined(image) ? 
          <img src={process.env.PUBLIC_URL + image.name} alt={image.alternate}/> 
          : placeholder
        }
      </div>
      <label className={styles['game-card-name']}>{name}</label>
      <div className={styles['game-card-rating']}>
        <span className={`${styles['game-card-rating-mark']} ${ratingClass}`}>{rating}</span>
        <label className={styles['game-card-rating-description']}>{description}</label>
      </div>
    </div>
  )
}

export default GameCard