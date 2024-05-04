import React, { Component } from 'react'

import LabeledInput from './LabeledInput'
import ImageSelector from './ImageSelector'
import LabeledDatePicker from './LabeledDatePicker'
import CompanySelector from './CompanySelector'

import ErrorCode from '../../api/ErrorCode'
import LoginContext from '../../LoginContext'
import { validateGameDev, validateGameImage, validateGameName,
  validateGamePub, validateGameRelease } from '../../utils/validationUtils'
import { saveGame as saveGameAPI } from '../../api/gameRestApi'

import styles from './SaveGameForm.module.css'

export class SaveGameForm extends Component {
  static contextType = LoginContext
  constructor(props) {
    super(props)

    this.state = this.buildStateFromGame(this.props.game)

    this.onSubmit = this.onSubmit.bind(this)
    this.setName = this.setName.bind(this)
    this.setImage = this.setImage.bind(this)
    this.setDate = this.setDate.bind(this)
    this.setDeveloper = this.setDeveloper.bind(this)
    this.setPublisher = this.setPublisher.bind(this)
    this.clearForm = this.clearForm.bind(this)
  }

  buildStateFromGame(game) {
    return {
      name:      { value: game?.name || '',         error: null },
      image:     { value: game?.image || null,      error: null },
      date:      { value: game?.date || new Date(), error: null },
      developer: { value: game?.developer || null,  error: null },
      publisher: { value: game?.publisher || null,  error: null }
    }
  }

  setName(name) {
    this.setState({ name: {
        value: name,
        error: validateGameName(name)
    }})
  }

  setImage(image) {
    this.setState({ image: {
        value: image,
        error: validateGameImage(image)
    }})
  }

  setDate(date) {
    this.setState({ date: {
        value: date,
        error: validateGameRelease(date)
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

  onSave(game) {
    if(typeof this.props.onSave === 'function') {
      this.props.onSave(game)
    }
  }

  saveImage() {

  }

  saveGame() {
    
  }

  onSubmit(event) {
    event.preventDefault()

    const { name:{value:name}, image:{value:image}, date:{value:date},
      developer:{value:developer}, publisher:{value:publisher}} = this.state
    const {login, setLogin} = this.context
    
    if(!validateGameName(name) && !validateGameRelease(date)
        && !validateGameDev(developer) && !validateGamePub(publisher)) {
      game = { id: this.props.game?.id || undefined, name, date, developer, publisher }
      
      saveGameAPI(game, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200) {
          console.log('game updated successfully')
          typeof this.props.onSave === 'function' ? this.props.onSave(game) : null
        } else if(status === 201) {
          game.id = json.id
          console.info('game created successfully')
          typeof this.props.onSave === 'function' ? this.props.onSave(game) : null
        } else if(status === 422 && json?.code === ErrorCode.DUPLICATED_FIELD) {
          this.setState( prev => ({...prev, name:{value:prev.name.value, error: 'is already used'}}) )
        } else {
          console.error(status, json)
        }
      })
    }
    if(!validateGameImage(image)) {

    }
  }

  clearForm() {
    this.setState(this.buildStateFromGame(this.props.game))
  }

  render() {
    const {name, image, date, developer, publisher} = this.state
    const {submitName = 'submit', clearButton = 'clear', error} = this.props
    return (
      <form onSubmit={this.onSubmit}>
        <LabeledInput label='Name' error={name?.error}
          value={name?.value} onChange={this.setName}
        />
        <ImageSelector label='Image' preferredRatio={3/4} warn='Image should be 3:4'
          error={image?.error} value={image?.value} onChange={this.setImage}
        />
        <LabeledDatePicker label='Release' error={date?.error}
          value={date?.value} onChange={this.setDate}
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
    )
  }
}

export default SaveGameForm