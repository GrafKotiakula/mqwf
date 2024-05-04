import React, { Component } from 'react'

import Review from '../_common/Review'
import AvatarImage from '../_common/AvatarImage'
import GRDataLoader from '../_common/GRDataLoader'
import PaginationBar from '../_common/PaginationBar'

import { formattedDate } from '../../utils/dataUtils'
import { findAllReviewsByGame } from '../../api/reviewsRestApi'

import styles from './GPReviewList.module.css'

const headerBuilder = ({user, date}) => (
  <div className={styles['gprv-header']}>
    <AvatarImage image={user?.image} className={styles['gprv-image']} />
    <a className={styles['gprv-username']} href={user?.id ? `/user/${user.id}` : '#'}>
      {user?.username}
    </a>
    <label className={styles['gprv-date']}>{formattedDate(date)}</label>
  </div>
)


export class GPReviewList extends Component {
  constructor(props) {
    super(props)

    const {initPage=1, pageAmount=initPage} = props

    this.state={
      page: initPage,
      pageAmount: pageAmount,
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
            pageAmount: totalPages,
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
    const {page, pageAmount} = this.state
    return (
      <GRDataLoader loadedClassName={styles['gprl-container']} isLoaded={this.state.reviews}>
        <PaginationBar className={styles['gprl-pagination-bar']} current={page} count={pageAmount} onSelect={this.setPage}/>
        <div className={styles['gprl-pagination-content']}>
          {this.state.reviews && this.state.reviews.map(r => <Review review={r} headerBuilder={headerBuilder} key={r.id}/>)}
        </div>
        <PaginationBar className={styles['gprl-pagination-bar']} current={page} count={pageAmount} onSelect={this.setPage}/>
      </GRDataLoader>
    )
  }
}

export default GPReviewList