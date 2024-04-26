import React, { Component } from 'react'

import Review from '../_common/Review'
import GRDataLoader from '../_common/GRDataLoader'
import PaginationBar from '../_common/PaginationBar'

import { formattedDate } from '../../utils/dataUtils'
import { findAllReviewsByUser } from '../../api/reviewsRestApi'

import styles from './UPReviewList.module.css'

const headerBuilder = ({game, date}) => (
  <div className={styles['uprv-header']}>
    <a className={styles['uprv-username']} href={game?.id ? `/game/${game.id}` : '#'}>
      {game?.name}
    </a>
    <label className={styles['uprv-date']}>{formattedDate(date)}</label>
  </div>
)

export class UPReviewList extends Component {
  constructor(props) {
    super(props)

    const {initPage=1, pageAmount=initPage} = props

    this.state={
      page: initPage,
      pageAmount: pageAmount,
      reviewsTotalCount: 0,
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
    const userId = this.props.user?.id
    if(userId) {
      findAllReviewsByUser(userId, page-1)
      .then(({status, json}) => {
        if(status === 200) {
          const {content, pagination: {pageNumber, totalPages, totalElements}} = json
          this.setState({
            page: pageNumber+1,
            pageAmount: totalPages,
            reviewsTotalCount: totalElements,
            reviews: content,
          })
        } else {
          console.error('Get all reviews by user:', {error, status, json})
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.user?.id !== this.props.user?.id) {
      this.loadReviews(1)
    } else if(prevState.page !== this.state.page) {
      this.loadReviews()
    }
  }

  componentDidMount() {
    this.loadReviews()
  }

  render() {
    const {page, pageAmount} = this.state
    return (
      <>
        <label className={styles['uprl-header']}>Reviews ({this.state.reviewsTotalCount || 0})</label>
        <GRDataLoader loadedClassName={styles['uprl-container']} isLoaded={this.state.reviews}>
          <PaginationBar className={styles['uprl-pagination-bar']} current={page} count={pageAmount} onSelect={this.setPage}/>
          <div className={styles['uprl-pagination-content']}>
            {this.state.reviews && this.state.reviews.map(r => <Review review={r} headerBuilder={headerBuilder} key={r.id}/>)}
          </div>
          <PaginationBar className={styles['uprl-pagination-bar']} current={page} count={pageAmount} onSelect={this.setPage}/>
        </GRDataLoader>
      </>
    )
  }
}

export default UPReviewList