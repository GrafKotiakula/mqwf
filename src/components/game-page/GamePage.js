import React, { Component } from 'react'

import RatingCharts from './RatingCharts'
import GameRatingList from '../_common/GameRatingList'
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

    this.onUpdate = this.onUpdate.bind(this)
  }

  loadGame(id = this.props.routing?.urlParams?.id) {
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
    this.loadGame()
  }

  onUpdate(game) {
    this.setState({game})
  }

  render() {
    const {game, error} = this.state
    return (
      <GRDataLoader error={error} isLoaded={game} loadedClassName={styles['gp-content']}>
        <GameHeader game={game} onUpdate={this.onUpdate}/>
        
        <h1 className={styles['gp-header']}>Marks</h1>
        <RatingCharts game={game}/>
        <GameRatingList ratings={game?.avgRating}/>

        <h1 className={styles['gp-header']}>Reviews</h1>
        <ReviewForm game={game}/>
        <GPReviewList game={game}/>
      </GRDataLoader>
    )
  }
}

export default withRouter(GamePage)