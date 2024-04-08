import React, { Component } from 'react'

import GameCard from './GameCard'
import SearchBar from '../_common/SearchBar'
import PaginationBar from '../_common/PaginationBar'

import { withRouter } from '../../utils/routingUtils'
import { getValueOrDefault, isDefined } from '../../utils/varUtils'

import styles from './GameList.module.css'
import { getAllGames } from '../../utils/restApi'

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
      games: null,
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
    console.log('text updating')
    this.setState(prev => {
      const newObj = {...prev}
      newObj.searchText=text
      this.updateQuery(newObj)
      return newObj
    })
  }

  calculatePage(page, min, max) {
    return Math.max(Math.min(page, max), min)
  }

  setPage(page) {
    this.setState(prev => {
      const newState = {...prev}
      newState.page = this.calculatePage(page, 1, newState.pageCount)
      this.updateQuery(newState)
      return newState
    })
  }

  updateGameList() {
    getAllGames(this.state.page - 1)
    .then(({status, json}) => {
      if(status !== 200) {
        console.error('Get all games:', {status, json})
      } else {
        const {content, pagination: {pageNumber, totalPages}} = json
        this.setState({
          page: pageNumber + 1,
          pageCount: totalPages,
          games: content
        })
      }
    })
  }

  componentDidMount() {
    this.updateGameList()
  }

  componentDidUpdate(_, prevState) {
    if(prevState.searchText !== this.state.searchText || prevState.page !== this.state.page){
      this.updateGameList()
    }
  }

  render() {
    return (
      <div className={styles['game-list-component']}>
        <div className={styles['game-list-top-controllers']}>
          <SearchBar className={styles['game-list-search']} onSearch={this.setText} value={this.state.searchText}/>
          <PaginationBar className={styles['game-list-pagination']} current={this.state.page} count={this.state.pageCount} onSelect={this.setPage}/>
        </div>
        
        {isDefined(this.state.games) ?
          (
            <div className={styles['game-list']}>
              {this.state.games.map((game, index) => <GameCard game={game} key={index} className={styles['game-list-element']}/>)}
            </div>
          )
          :
          <span style={{margin: '0 auto'}}>Loading...</span>
        }
        
        <PaginationBar className={styles['game-list-pagination']} current={this.state.page} count={this.state.pageCount} onSelect={this.setPage}/>
      </div>
    )
  }
}

export default withRouter(GameList)