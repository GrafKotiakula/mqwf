import React, { Component } from 'react'
import RatingSelector from './RatingSelector'

import GRCollapsible from '../_common/GRCollapsible'
import GRDataLoader from '../_common/GRDataLoader'

import LoginContext from '../../LoginContext'
import { getDescriptionGetter, negativeRatings, neutralRatings, positiveRatings,
  negativeStyleSelector, neutralStyleSelector, positiveStyleSelector, restorApiRating } from '../../utils/dataUtils'
import { isNotEmptyString } from '../../utils/varUtils'
import { isLoggedin } from "../../api/authRestApi"
import { findReviewByGameAndAuth, saveReview } from "../../api/reviewsRestApi"
import ErrorCode from "../../api/ErrorCode"
import { validateReviewText } from '../../utils/validationUtils'

import styles from './ReviewForm.module.css'

const minTextareaHeight = 100 // px

export class ReviewForm extends Component {
  
  static contextType = LoginContext

  constructor(props){
    super(props)

    this.state = {
      ...this.fromReview(),
      error: null,
      isLoaded: false
    }

    this.setText = this.setText.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  setText({target:textarea}) {
    const text = textarea.value
    textarea.style.height = `${minTextareaHeight}px`
    textarea.style.height = `${Math.max(textarea.scrollHeight + 5, minTextareaHeight)}px`
    if(isNotEmptyString(text)) {
      this.setState({ 
        reviewText: text,
        error: validateReviewText(text)
      })
    } else {
      this.setState({
        reviewText: '',
        error: null
      })
    }
  }

  setRatingValue(containerName, name, value) {
    this.setState(prev => {
      const newState = {...prev}
      newState[containerName][name] = value
      return newState
    })
  }

  clearForm() {
    this.setState({
      reviewText: '',
      error: undefined,
      positiveRatings: positiveRatings(null),
      neutralRatings: neutralRatings(null),
      negativeRatings: negativeRatings(null),
    })
  }

  fromReview(review) {
    return {
      reviewId: review?.id,
      reviewText: review?.text ? review.text : '',
      positiveRatings: positiveRatings(review?.rating),
      neutralRatings: neutralRatings(review?.rating),
      negativeRatings: negativeRatings(review?.rating),
    }
  }

  loadRating() {
    const gameId = this.props.game?.id
    const {login, setLogin} = this.context
    if(gameId && isLoggedin(login)) {
      findReviewByGameAndAuth(gameId, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200) {
          this.setState({
            ...this.fromReview(json),
            isLoaded: true
          })
        } else if(status === 404 && json?.code === ErrorCode.REVIEW_BY_GAME_AND_USER_NOT_FOUND) {
          console.debug('Review not found')
          this.setState({
            ...this.fromReview(),
            isLoaded: true
          })
        } else {
          console.error({status, json})
        }
      })
    }
  }

  onSubmit(event) {
    event.preventDefault()
    if(!this.state.error) {
      const {login, setLogin} = this.context
      const review = {
        id: this.state.reviewId,
        text: this.state.reviewText ? this.state.reviewText : null,
        rating: restorApiRating({
          ...this.state.positiveRatings,
          ...this.state.neutralRatings,
          ...this.state.negativeRatings,
        }),
        gameId: this.props.game?.id
      }
      
      saveReview(review, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status >= 400) {
          console.error('Review save error: ', {error, status, json})
        } else {
          console.debug('Review save success')
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {login} = this.context
    if(!isLoggedin(login) && this.state.isLoaded) {
      this.setState({
        isLoaded: false
      })
    }
    if((prevProps.game?.id !== this.props.game?.id)
     || (isLoggedin(login) && !this.state.isLoaded)) {
      this.loadRating()
    }
  }

  componentDidMount() {
    this.loadRating()
  }

  buildRatingSelectors(ratings, styleSelector, setRatingValue) {
    return (
      <>
        {
          Object.entries(ratings).map(([k,v]) => (
            <RatingSelector key={k} name={k} value={v} 
              getDesc={getDescriptionGetter(k)} styleSelector={styleSelector} 
              className={styles['rf-selector']} onChange={value => setRatingValue(k,value)}
            />
          ))
        }
      </>
    )
  }

  render() {
    let {name='My review', disabled=false} = this.props

    if(!isLoggedin(this.context.login)) {
      name = `${name} (login required)`
      disabled = true
    }

    return (
      <GRCollapsible name={name} className={styles['rf-collapsible']} disabled={disabled} contentClassName={styles['rf-collapsible-content']}>
        <GRDataLoader isLoaded={this.state.isLoaded}>
          <form onSubmit={this.onSubmit} className={styles['review-form']}>
            
            <label className={styles['rf-header']}>Ratings</label>
            {this.buildRatingSelectors(this.state.positiveRatings, positiveStyleSelector, (n,v)=>this.setRatingValue('positiveRatings',n,v))}
            {this.buildRatingSelectors(this.state.neutralRatings, neutralStyleSelector, (n,v)=>this.setRatingValue('neutralRatings',n,v))}
            {this.buildRatingSelectors(this.state.negativeRatings, negativeStyleSelector, (n,v)=>this.setRatingValue('negativeRatings',n,v))}
            
            <label className={styles['rf-header']}>Comment</label>
            <div className={styles['rf-review-text-container']}>
              {this.state.error && <label className={styles['rf-review-text-error']}>{this.state.error}</label>}
              <textarea style={{minHeight: `${minTextareaHeight}px`}}
                value={this.state.reviewText} onChange={this.setText}
              />
            </div>
  
            <div className={styles['rv-buttons']}>
              <input type='submit' value='submit' disabled={this.state.error}/>
              <input type='button' value='clear' onClick={this.clearForm}/>
            </div>
  
          </form>
        </GRDataLoader>
      </GRCollapsible>
    )
  }
}

export default ReviewForm