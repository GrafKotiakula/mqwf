import React from 'react'

import GRCollapsible from '../_common/GRCollapsible'
import Overlappable from '../_common/Overlappable'
import { negativeRatings, neutralRatings, positiveRatings,
    positiveStyleSelector, neutralStyleSelector, negativeStyleSelector,
    getDescriptionByName } from '../../utils/dataUtils'

import styles from './GameRatingList.module.css'

const displayRatings = (ratings, styleSelector) => (
  <>
    {Object.entries(ratings).map( ([key, value]) => (
      <div key={key} className={`${styles['rl-item']} ${styleSelector(value)}`}>
        <label className={styles['rl-item-name']}>{key}</label>
        <div className={styles['rl-item-rating']}>
          <label className={styles['rl-item-rating-text']}>
            {getDescriptionByName(key, value)}
            <label className={styles['rl-item-rating-mark']}>{value}</label>
            /10
          </label>
        </div>
      </div>
    ))}
  </>
)

const displayPositiveRatings = ratings => displayRatings(ratings, positiveStyleSelector)
const displayNeutralRatings = rating => displayRatings(rating, neutralStyleSelector)
const displayNegativeRatings = rating => displayRatings(rating, negativeStyleSelector)

const GameRatingList = ({ratings, name='Rating details', grouped=true, className=''}) => {
  return (
    <GRCollapsible name={name} className={`${className} ${styles['rl-collapsible']}`} 
      triggerClassName={className}
    >
      <Overlappable showOverlap={!ratings} className={styles['rl-collapsible-content']}>
      {grouped && (
          <label className={styles['rl-header']}>
            Positive
          </label>
        )}
        {displayPositiveRatings(positiveRatings(ratings))}
        {grouped && (
          <label className={styles['rl-header']}>
            Neutral
          </label>
        )}
        {displayNeutralRatings(neutralRatings(ratings))}
        {grouped && (
          <label className={styles['rl-header']}>
            Negative
          </label>
        )}
        {displayNegativeRatings(negativeRatings(ratings))}
      </Overlappable>
    </GRCollapsible>
  )
}

export default GameRatingList