import React, { Component } from 'react'

import GameCard from './GameCard'
import SearchBar from '../_common/SearchBar'
import PaginationBar from '../_common/PaginationBar'

import { withRouter } from '../../utils/routingUtils'
import { getValueOrDefault } from '../../utils/varUtils'

import styles from './GameList.module.css'

// tmp data
const buildGame = ({imgName, gameName, rating}) => {
  return {
    name: gameName,
    release: new Date(),
    image: imgName === null ? null : {
      id: 'IMG_ID',
      name: imgName,
      alternate: 'awesome image alt'
    },
    avgRating: {
      mainRating: rating
    }
  }
}
// tmp data
const gameList = [].concat(...Array(5).fill([
  buildGame({
    imgName: 'img-1.jpg',
    gameName: 'Awesome game very prevery super duper long name 2',
    rating: 8.8
  }),
  buildGame({
    imgName: 'img-2.jpg',
    gameName: 'Awesome game very prevery super duper long name 3 (even loooooooonger)',
    rating: 6.1
  }),
  buildGame({
    imgName: 'img-3.jpg',
    gameName: 'no hope',
    rating: 2.2
  }),
  buildGame({
    imgName: null,
    gameName: 'LOGO',
    rating: 0
  })
]));

const serchTextParameterName = 'search'
const pageParameterName = 'page'

export class GameList extends Component {
  constructor(props){
    super(props)

    const page = Math.max(getValueOrDefault(this.props.routing.queryParams.get(pageParameterName), '1'), 1)

    this.state = {
      searchText: getValueOrDefault(this.props.routing.queryParams.get(serchTextParameterName), ''),
      pageCount: Math.max(15, page),
      page: page,
    }

    this.setText = this.setText.bind(this)
    this.setPage = this.setPage.bind(this)
  }
  
  updateQuery(state) {
    this.props.routing.setQueryParams({
      [serchTextParameterName]: state.searchText,
      [pageParameterName]: state.page
    })
  }

  setText(text) {
    this.setState(prev => {
      prev.searchText=text
      prev.pageCount=100
      this.updateQuery(prev)
      return prev
    })
  }

  calculatePage(page, min, max) {
    return Math.max(Math.min(page, max), min)
  }

  setPage(page) {
    this.setState(prev => {
      prev.page = this.calculatePage(page, 1, prev.pageCount)
      this.updateQuery(prev)
      return prev
    })
  }

  // TODO: load data (componentDidMount, componentDidUpdate)

  render() {
    const games = gameList.slice(0, gameList.length - (this.state.page - 1) * 3)
    return (
      <div className={styles['game-list-component']}>
        <div className={styles['game-list-top-controllers']}>
          <SearchBar className={styles['game-list-search']} onSearch={this.setText} value={this.state.searchText}/>
          <PaginationBar className={styles['game-list-pagination']} current={this.state.page} count={this.state.pageCount} onSelect={this.setPage}/>
        </div>
        
        <div className={styles['game-list']}>
          {games.map((game, index) => <GameCard game={game} key={index} className={styles['game-list-element']}/>)}
        </div>
        
        <PaginationBar className={styles['game-list-pagination']} current={this.state.page} count={this.state.pageCount} onSelect={this.setPage}/>
      </div>
    )
  }
}

export default withRouter(GameList)