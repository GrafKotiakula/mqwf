import React, { Component } from 'react'

import GameCard from './GameCard'
import SearchBar from '../_common/SearchBar'
import PaginationBar from '../_common/PaginationBar'
import GRDataLoader from '../_common/GRDataLoader'

import { withRouter } from '../../utils/routingUtils'
import { pageNumberIsOk } from '../../utils/varUtils'
import { findGamesByOptionalName, getAllGames } from "../../api/gameRestApi"

import styles from './GameList.module.css'

const serchTextParameterName = 'search'
const pageParameterName = 'page'

export class GameList extends Component {
  constructor(props){
    super(props)

    const pageUrlValue = this.props.routing?.queryParams.get(pageParameterName)
    const page = parseInt(pageUrlValue || 1)

    this.state = {
      searchText: this.props.routing?.queryParams.get(serchTextParameterName) || '',
      pageCount: Math.max(15, page),
      page: page,
      games: null,
      error: pageNumberIsOk(page) ? null : 400,
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
      const newState = {
        ...prev,
        searchText: text,
        games: null,
        error: null
      }
      this.updateQuery(newState)
      return newState
    })
  }

  calculatePage(page, min, max) {
    return Math.max(Math.min(page, max), min)
  }

  setPage(page) {
    this.setState(prev => {
      const newState = {
        ...prev,
        page: this.calculatePage(page, 1, prev.pageCount)
      }
      this.updateQuery(newState)
      return newState
    })
  }

  loadGameList(serachText = this.state.searchText, page = this.state.page) {
    findGamesByOptionalName(serachText, page - 1)
    .then(({status, json}) => {
      if(status !== 200) {
        this.setState({
          games: null,
          error: status,
        })
      } else {
        const {content, pagination: {pageNumber, totalPages}} = json
        this.setState({
          page: pageNumber + 1,
          // pageCount: totalPages,
          pageCount: Math.max(totalPages, 15), // FOR DEMO
          games: content,
          error: null,
        })
      }
    })
  }

  componentDidMount() {
    if(!this.state.error) {
      this.loadGameList()
    }
  }

  componentDidUpdate(_, prevState) {
    if( (prevState.page !== this.state.page && pageNumberIsOk(this.state.page))
        || prevState.searchText !== this.state.searchText ){
      this.loadGameList()
    }
  }

  render() {
    return (
      <GRDataLoader error={this.state.error} isLoaded={this.state.games} loadedClassName={styles['game-list-component']}>
        <div className={styles['game-list-top-controllers']}>
          <SearchBar className={styles['game-list-search']} onSearch={this.setText} value={this.state.searchText}/>
          <PaginationBar className={styles['game-list-pagination']} current={this.state.page} count={this.state.pageCount} onSelect={this.setPage}/>
        </div>
        <div className={styles['game-list']}>
          {this.state.games?.map((game, index) => <GameCard game={game} key={index} className={styles['game-list-element']}/>)}
        </div>
        <PaginationBar className={styles['game-list-pagination']} current={this.state.page} count={this.state.pageCount} onSelect={this.setPage}/>
      </GRDataLoader>
    )
  }
}

export default withRouter(GameList)