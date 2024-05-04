import React, { Component } from 'react'

import Popup from '../_common/Popup'
import LabeledInput from '../_common/LabeledInput'
import CompanySelector from '../_common/CompanySelector'
import LabeledDatePicker from '../_common/LabeledDatePicker'

import ErrorCode from '../../api/ErrorCode'
import LoginContext from '../../LoginContext'
import { validateGameDev, validateGameName, validateGamePub, validateGameRelease } from '../../utils/validationUtils'
import { createGame as createGameAPI } from '../../api/gameRestApi'

import styles from './CreateGame.module.css'

export class CreateGame extends Component {
  static contextType = LoginContext
  constructor(props) {
    super(props)

    this.state = {
      ...this.buildStateFromGame(),
      showPopup: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.setName = this.setName.bind(this)
    this.setRelease = this.setRelease.bind(this)
    this.setDeveloper = this.setDeveloper.bind(this)
    this.setPublisher = this.setPublisher.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
  }

  buildStateFromGame() {
    return {
      name:      { error: null, value: '' },
      release:   { error: null, value: new Date() },
      developer: { error: null, value: null },
      publisher: { error: null, value: null }
    }
  }

  setVisible(visible) {
    this.setState({showPopup: visible})
  }

  show() {
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }

  setName(name) {
    this.setState({ name: {
        value: name,
        error: validateGameName(name)
    }})
  }

  setRelease(release) {
    this.setState({ release: {
        value: release,
        error: validateGameRelease(release)
    }})
  }

  setDeveloper(dev) {
    console.log('Set dev:', dev)
    this.setState({ developer: {
        value: dev,
        error: validateGameDev(dev)
    }})
  }

  setPublisher(pub) {
    this.setState({ publisher: {
        value: pub,
        error: validateGamePub(pub)
    }})
  }

  onCreat(game) {
    if(typeof this.props.onCreate === 'function') {
      this.props.onCreate(game)
    }
    this.hide()
  }

  onSubmit(event) {
    event.preventDefault()

    const { name:{value:name}, release:{value:release},
      developer:{value:developer}, publisher:{value:publisher}} = this.state
    const {login, setLogin} = this.context
    
    if(!validateGameName(name) && !validateGameRelease(release)
        && !validateGameDev(developer) && !validateGamePub(publisher)) {
      const game = { name, release, developer, publisher }
      
      createGameAPI(game, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 201) {
          console.info('game created successfully')
          this.onCreat(json)
        } else if(status === 422 && json?.code === ErrorCode.DUPLICATED_FIELD) {
          this.setState( prev => ({...prev, name:{value:prev.name.value, error: 'is already used'}}) )
        } else {
          console.error(status, json)
        }
      })
      .catch(error => {
        console.error(error)
        this.hide()
      })
    }
  }

  clearForm() {
    this.setState(this.buildStateFromGame())
  }

  render() {
    const {name, release, developer, publisher, showPopup} = this.state
    const {submitName = 'submit', clearButton = 'clear'} = this.props
    return (
      <>
        <button className={styles['create-btn']} type='button' onClick={this.show} />
        <Popup show={showPopup} onClose={this.hide}>
          <form onSubmit={this.onSubmit}>
            <LabeledInput label='Name' error={name?.error}
              value={name?.value} onChange={this.setName}
            />
            <LabeledDatePicker label='Release' error={release?.error}
              value={release?.value} onChange={this.setRelease}
            />
            <CompanySelector label='Developer' error={developer?.error}
              value={developer?.value} onChange={this.setDeveloper}
            />
            <CompanySelector label='Publisher' error={publisher?.error}
              value={publisher?.value} onChange={this.setPublisher}
            />
            <div className={styles['buttons']}>
              <button type='submit'>{submitName}</button>
              <button type='button' onClick={this.clearForm}>{clearButton}</button>
            </div>
          </form>
        </Popup>
      </>
      
    )
  }
}

export default CreateGame