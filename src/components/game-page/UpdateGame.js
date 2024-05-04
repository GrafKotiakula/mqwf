import React, { Component } from 'react'

import Popup from '../_common/Popup'
import LabeledInput from '../_common/LabeledInput'
import ImageSelector from '../_common/ImageSelector'
import CompanySelector from '../_common/CompanySelector'
import LabeledDatePicker from '../_common/LabeledDatePicker'

import ErrorCode from '../../api/ErrorCode'
import LoginContext from '../../LoginContext'
import { validateGameDev, validateGameImage, validateGameName, validateGamePub, validateGameRelease } from '../../utils/validationUtils'
import { updateGame as updateGameAPI, updateGameImage as updateGameImageAPI } from '../../api/gameRestApi'

import styles from './UpdateGame.module.css'

export class CreateGame extends Component {
  static contextType = LoginContext
  constructor(props) {
    super(props)

    this.state = {
      ...this.buildStateFromGame(props?.game),
      showPopup: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.setName = this.setName.bind(this)
    this.setImage = this.setImage.bind(this)
    this.setRelease = this.setRelease.bind(this)
    this.setDeveloper = this.setDeveloper.bind(this)
    this.setPublisher = this.setPublisher.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
  }

  buildStateFromGame(game = this.props.game) {
    return {
      name:      { error: null, value: game?.name || '' },
      image:     { error: null, value: null },
      release:   { error: null, value: game?.date || new Date() },
      developer: { error: null, value: game?.developer || null },
      publisher: { error: null, value: game?.publisher || null }
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

  setImage(image) {
    this.setState({ image: {
        value: image,
        error: validateGameImage(image)
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

  onUpdate(game) {
    if(typeof this.props.onUpdate === 'function') {
      this.props.onUpdate(game)
    }
  }

  updateImage() {
    const { image:{value:image} } = this.state
    const {login, setLogin} = this.context
    if(image && !validateGameImage(image)) {
      updateGameImageAPI(image, login, this.props.game?.id)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200) {
          console.info('game image updated successfully')
          this.onUpdate(json)
        } else if(status === 422 && json?.code === ErrorCode.DUPLICATED_FIELD) {
          this.setState( prev => ({...prev, name:{value:prev.name.value, error: 'is already used'}}) )
        } else {
          console.error(status, json)
        }
      })
    }
  }

  updateGame() {
    const { name:{value:name}, release:{value:release},
      developer:{value:developer}, publisher:{value:publisher}} = this.state
    const {login, setLogin} = this.context
    
    if(!validateGameName(name) && !validateGameRelease(release)
        && !validateGameDev(developer) && !validateGamePub(publisher)) {
      const game = { id: this.props.game?.id, name, release, developer, publisher }
      
      updateGameAPI(game, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200) {
          console.info('game updated successfully')
          this.onUpdate(json)
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

  onSubmit(event) {
    event.preventDefault()

    this.updateGame()
    this.updateImage() 
  }

  clearForm() {
    this.setState(this.buildStateFromGame())
  }

  render() {
    const {name, image, release, developer, publisher, showPopup} = this.state
    const {submitName='update', clearButton='clear', text='update'} = this.props
    return (
      <>
        <button className={styles['create-btn']} type='button' onClick={this.show}>{text}</button>
        <Popup show={showPopup} onClose={this.hide}>
          <form onSubmit={this.onSubmit}>
            <LabeledInput label='Name' error={name?.error}
              value={name?.value} onChange={this.setName}
            />
            <ImageSelector label='Image' preferredRatio={3/4} warn='Image should be 3:4'
              error={image?.error} value={image?.value} onChange={this.setImage}
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