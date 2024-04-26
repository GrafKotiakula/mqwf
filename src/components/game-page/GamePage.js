import React, { Component } from 'react'

import RatingCharts from './RatingCharts'
import GameRatingList from './GameRatingList'
import ReviewForm from './ReviewForm'
import GameHeader from './GameHeader'
import GRDataLoader from '../_common/GRDataLoader'

import { withRouter } from '../../utils/routingUtils'
import { getGameById } from "../../api/gameRestApi"

import styles from './GamePage.module.css'
import GPReviewList from './GPReviewList'

export class GamePage extends Component {
  constructor(props){
    super(props)

    this.state = {
      game: null,
      error: null
    }
  }

  loadGame(id) {
    if(id) {
      getGameById(id)
      .then(({status, json}) => {
        if (status === 200) {
          this.setState({
            game: json,
            error: null
          })
        } else {
          this.setState({
            game: null,
            error: status
          })
        } 
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const id = this.props.routing?.urlParams?.id
    if(this.state.game?.id !== id && prevProps.routing?.urlParams?.id !== id) {
      this.loadGame(id)
    }
  }

  componentDidMount() {
    this.loadGame(this.props.routing?.urlParams?.id)
  }

  render() {
    return (
      <GRDataLoader error={this.state.error} isLoaded={this.state.game} loadedClassName={styles['gp-content']}>
        <GameHeader game={this.state.game}/>
        
        <label className={styles['gp-header']}>Marks</label>
        <RatingCharts game={this.state.game}/>
        <GameRatingList ratings={this.state.game?.avgRating}/>

        <label className={styles['gp-header']}>Reviews</label>
        <ReviewForm game={this.state.game}/>
        <GPReviewList game={this.state.game}/>
      </GRDataLoader>
    )
  }
}

export default withRouter(GamePage)