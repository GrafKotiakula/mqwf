import React, { useContext } from 'react'

import GRImage from '../_common/GRImage'
import PropertyList from '../_common/PropertyList'
import { formattedDate, getMainRatingDesc, hasRole, positiveStyleSelector } from '../../utils/dataUtils'
import { Role } from '../../api/userRestApi'

import styles from './GameHeader.module.css'
import LoginContext from '../../LoginContext'
import UpdateGame from './UpdateGame'

const selectPropsToShow = (game, loginUser) => {
  if(hasRole(loginUser, Role.moderator, Role.admin)) {
    return {
      ID: game?.id,
      Release: formattedDate(game?.release),
      Developer: game?.developer?.name,
      Publisher: game?.publisher?.name,
    }
  } else {
    return {
      Release: formattedDate(game?.release),
      Developer: game?.developer?.name,
      Publisher: game?.publisher?.name,
    }
  }
}

const GameHeader = ({game, onUpdate}) => {
  const loginUser = useContext(LoginContext)?.login?.user
  const {name, image, avgRating} = game
  const rating = avgRating?.mainRating?.toFixed(1)
  
  return (
    <div className={styles['game-header']}>
      <GRImage image={image} className={styles['game-img']}/>
      <div className={styles['game-descriptions']}>
        <label className={styles['gd-name']}>{name}</label>
        <PropertyList values={selectPropsToShow(game, loginUser)}/>
        {hasRole(loginUser, Role.moderator, Role.admin) && <UpdateGame game={game} onUpdate={onUpdate}/>}
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