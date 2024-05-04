import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

import styles from './SearchBar.module.css'

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.onInput = this.onInput.bind(this)
    this.onSubmit = this.buildOnSubmit(props.onSearch)

    this.state = {
      text: props.value
    }
  }

  buildOnSubmit(callBack) {
    if(typeof callBack === 'function') {
      return (event) => {
        event.preventDefault()
        callBack(this.state.text)
      }
    } else {
      return undefined
    }
  }

  onInput({target}) {
    this.setState( {text: target.value} )
  }

  render() {
    const {placeholder='Search...', autoComplete='off', className} = this.props
    return (
      <form className={`${className} ${styles['search-bar']}`} onSubmit={this.onSubmit}>
        <input 
          className={styles['search-bar-input']} 
          name='search-text' 
          type='text' 
          value={this.state.text} 
          onChange={this.onInput}
          placeholder={placeholder} 
          autoComplete={autoComplete}
        />
        <button className={styles['search-bar-button']} type='submit'>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
    )
  }
}

export default SearchBar