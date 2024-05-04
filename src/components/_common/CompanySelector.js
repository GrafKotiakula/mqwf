import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import Popup from './Popup'

import LoginContext from '../../LoginContext'
import { findAllCompaniesByName, findOrCreateCompanyByName } from '../../api/companyRestApi'
import { validateCompanyName } from '../../utils/validationUtils'

import styles from './CompanySelector.module.css'

export class CompanySelector extends Component {
  static contextType = LoginContext
  constructor(props) {
    super(props)
    
    this.suggestionsAmount = this.props.suggestionsAmount || 5
    this.searchDelay = this.props.searchDelay || 500
    this.callBack = typeof this.props.onChange === 'function' ? this.props.onChange : () => {}

    this.state = {
      text: '',
      list: this.buildList([]),
      value: null,
      error: null,
      popupShow: false,
      timeout: null,
      searching: false,
    }

    this.setTextE = this.setTextE.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.hidePopup = this.hidePopup.bind(this)
    this.setValueAndHideE = this.setValueAndHideE.bind(this)
    this.clearE = this.clearE.bind(this)
    this.getOrCreateE = this.getOrCreateE.bind(this)
  }

  buildList(companies, amount=this.suggestionsAmount){
    let i = 0
    const result = new Array(amount)
    result.fill({})
    for(; i < amount && i < companies.length; ++i) {
        result[i] = companies[i]
    }
    return result;
  }

  findCompanies(name = this.state.text) {
    clearTimeout(this.state.timeout)
    if(!name || validateCompanyName(name)){
      this.setState({list: this.buildList([]), timeout: null, searching: false})
    } else {
      this.setState({searching: true})
      const timeout = setTimeout(() => {
        this.setState({list: this.buildList([])})
        
        findAllCompaniesByName(name)
        .then(({status, json}) => {
          let companies = []
          if(status === 200 && json?.content) {
            companies = json.content
          }
          this.setState({
            list: this.buildList(companies),
            timeout: null,
            searching: false
          })
        })
      }, this.searchDelay)
      this.setState({timeout})
    }
  }

  getOrCreateE(e, ...rest) {
    e.stopPropagation()
    this.getOrCreate(...rest)
  }

  getOrCreate(name = this.state.text) {
    clearTimeout(this.state.timeout)
    if(name && !validateCompanyName(name)) {
      this.setState({searching: true})

      const {login, setLogin} = this.context
      this.setState({searching: true, timeout: null})

      findOrCreateCompanyByName(name, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200 || status === 201) {
          this.setState({
            value: json,
            searching: false, 
            popupShow: false
          })
        }
        if(status === 201) {
          console.info(`Company ${name} have been created successfully`)
        }
        if(status >= 400) {
          console.error(status, json)
        }
      })
      .catch(error => console.error(error))
    }
  }

  setTextE({target: {value}}, ...rest) {
    this.setText(value, ...rest)
  }

  setText(text) {
    this.setState(prev => {
      const newState = {
        ...prev,
        text: text,
        error: validateCompanyName(text)
      }
      return newState
    }, () => this.findCompanies())
  }

  setError(error) {
    this.setState(error)
  }

  setValue(value) {
    this.setState({ value })
    this.callBack(value)

  }

  setValueAndHideE(e, value) {
    this.setState({
        value: value,
        popupShow: false
      })
    this.callBack(value)
  }

  showPopup() {
    this.setState({popupShow: true})
  }

  hidePopup() {
    this.setState({popupShow: false})
  }

  clearE(e, ...rest) {
    e.stopPropagation()
    this.clear(...rest)
  }

  clear() {
    this.setState({
      text: '',
      value: null,
      error: null,
      popupShow: false
    })
    this.callBack(null)
  }

  render() {
    const {text, error, popupShow, list, searching} = this.state
    const {label, name, autoComplete='off', placeholder} = this.props
    const value = this.props.value === undefined ? this.state.value : this.props.value
    return (
      <div className={styles['labeled-input']}>
        {label && <label className={styles['input-label']}>{label}</label>}
        <div className={styles['select-body']} tabIndex='0' onClick={this.showPopup}>
          <input type='text' className={styles['selected-text']} placeholder={placeholder} value={value?.name || ''} disabled/>
          { value ? 
            <button type='button' className={`${styles['input-btn']}`} onClick={this.clearE}>
              <FontAwesomeIcon icon={faXmark} size='1x'/>
            </button>
            :
            <button type='button' className={`${styles['input-btn']}`} onClick={this.showPopup}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size='1x'/>
            </button>
          }
        </div>
        <Popup show={popupShow} onClose={this.hidePopup} bgColor='rgba(0,0,0,.2)'>
          <div className={styles['label-container']}>
            {label && <label className={styles['input-label']}>{label}</label>}
            {error && <label className={`${styles['input-error']} invisible-scroll`}>{error}</label>}
          </div>
          <div className={styles['input-body']} tabIndex='0'>
            <input type='text' name={name}
              value={text} onChange={this.setTextE} 
              autoComplete={autoComplete} placeholder={placeholder}
            />
            <button type='button' className={`${styles['input-btn']}`} disabled={!text || error} onClick={this.getOrCreateE}>
              <FontAwesomeIcon icon={faPlus} size='1x'/>
            </button>
          </div>
          <label className={styles['status-bar']}>{!list[0]?.name && (searching ? 'Searching...' : 'No results')}</label>
          <div className={styles['list']}>
            {list.map((v, i) => 
              <span className='button invisible-scroll' key={v?.id || i} onClick={e => this.setValueAndHideE(e,v)}>{v?.name}</span>
            )}
          </div>
        </Popup>
      </div>
    )
  }
}

export default CompanySelector