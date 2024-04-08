import React, { Component } from 'react'

import PaginationBar from '../_common/PaginationBar'
import Review from './Review'

import styles from './ReviewList.module.css'
import Overlappable from '../_common/Overlappable'
import { findAllReviewsByGame } from '../../utils/restApi'

export class ReviewList extends Component {
  constructor(props) {
    super(props)

    const {initPage=1, maxPage=initPage} = props

    this.state={
      page: initPage,
      maxPage: maxPage,
      reviews: null
    }

    this.setPage = this.setPage.bind(this)
  }

  setPage(page) {
    this.setState({
      page: page
    })
  }

  loadReviews(page = this.state.page) {
    const gameId = this.props.game?.id
    if(gameId) {
      findAllReviewsByGame(gameId, page-1)
      .then(({status, json}) => {
        if(status === 200) {
          const {content, pagination: {pageNumber, totalPages}} = json
          this.setState({
            page: pageNumber+1,
            pageNumber: totalPages,
            reviews: content,
          })
        } else {
          console.error('Get all reviews by game:', {error, status, json})
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.game?.id !== this.props.game?.id) {
      this.loadReviews(1)
    } else if(prevState.page !== this.state.page) {
      this.loadReviews()
    }
  }

  componentDidMount() {
    this.loadReviews()
  }

  render() {
    const {page, maxPage} = this.state
    return (
      <Overlappable className={styles['rl-container']} showOverlap={!this.state.reviews}>
        <PaginationBar className={styles['rl-pagination-bar']} current={page} count={maxPage} onSelect={this.setPage}/>
        <div className={styles['rl-pagination-content']}>
          {this.state.reviews && this.state.reviews.map(r => <Review review={r} key={r.id}/>)}
        </div>
        <PaginationBar className={styles['rl-pagination-bar']} current={page} count={maxPage} onSelect={this.setPage}/>
      </Overlappable>
    )
  }
}

export default ReviewList