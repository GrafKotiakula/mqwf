import React, { Component, useId } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { aspectRatioIsOk } from '../../utils/varUtils'
import { toHumanSizeFormat } from '../../utils/dataUtils'

import styles from './ImageSelector.module.css'

export class ImageSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      warn: null,
      error: null,
      file: props.value || null,
    }

    this.wrongAspectRationWarn = props.warn || 'Wrong aspect ratio'
    this.maxSize = props.maxSize || 1024 * 1024 * 2 // 2 MiB
    
    this.onSelect = this.onSelect.bind(this)
    this.clear = this.clear.bind(this)
    this.failToLoad = this.failToLoad.bind(this)
  }

  failToLoad(error) {
    console.error('Failed to load image', error)
    this.setStateAndCallBack({
      error: 'Failed to load image',
      warn: null,
      file: null
    })
  }

  onSelect({target}) {
    const file = target.files?.[0]
    if(file) {
      if(file.size > this.maxSize) {
        this.setStateAndCallBack({
          error: `File must not be bigger than ${toHumanSizeFormat(this.maxSize)}`,
          warn: null,
          file: null,
        })
        console.error(`File size (${file.size}) is biiger than maxSize (${this.maxSize})`)
      } else {
        if(this.props.preferedRatio) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            const imageElement = new Image()
            
            imageElement.addEventListener('load', ({currentTarget}) => {
              const {naturalWidth, naturalHeight} = currentTarget
              let warn
              if(!aspectRatioIsOk(naturalWidth, naturalHeight, this.props.preferedRatio)) {
                warn = this.wrongAspectRationWarn
                console.warn(`Wrong aspect ratio: ${naturalWidth/naturalHeight}, but expected ${this.props.preferedRatio}`)
              } else {
                warn = null
              }
              this.setStateAndCallBack({
                error: null,
                warn: warn,
                file: file
              })
            })
            imageElement.addEventListener('error', this.failToLoad)

            imageElement.src = reader.result?.toString() || ''
          })
          reader.addEventListener('error', this.failToLoad)
          reader.readAsDataURL(file)
        }
      }
    } else {
      console.log('Not selected')
      this.clear()
    }
  }

  selectDescriber() {
    const {placeholder='Image not selected'} = this.props
    const {warn, error, file} = this.state
    if(error) {
      return <span className={`${styles['input-text']} ${styles['file-error']} invisible-scroll`}>{error}</span>
    } else if(file) {
      return <span className={`${styles['input-text']} ${styles['file-name']} invisible-scroll`}>{file.name}</span>
    } else {
      return <span className={`${styles['input-text']} ${styles['placeholder']} invisible-scroll`}>{placeholder}</span>
    }
  }

  clear() {
    this.setStateAndCallBack({
      error: null,
      warn: null,
      file: null
    })
  }

  setStateAndCallBack(state) {
    this.setState(prev => {
      const newState = {...prev}
      state.hasOwnProperty('error') && (newState.error = state.error)
      state.hasOwnProperty('warn') && (newState.warn = state.warn)
      state.hasOwnProperty('file') && (newState.file = state.file)
      if(state.hasOwnProperty('file') && state.file !== prev.file){
        Promise.resolve(state.file)
        .then(file => typeof this.props.onChange === 'function' && this.props.onChange(file))
      }
      return newState
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.value !== this.props.value && this.props.value !== this.state.file) {
      this.setState({
        error: null,
        warn: null,
        file: this.props.value
      })
    }
  }

  render() {
    const {id, buttonText = 'Select', label} = this.props
    const {warn, error, file} = this.state

    return (
      <div className={styles['labeled-input']}>
        <div className={styles['input-header']}>
          {label && <label className={styles['input-label']}>{label}</label>}
          {warn && <label className={`${styles['input-warn']} invisible-scroll`}>{warn}</label>}
        </div>
        <input type='file' accept='image/*'
          id={id}
          onChange={this.onSelect}
          style={{display: 'none'}}
        />
        <div className={styles['input-body']} tabIndex="0">
          <label htmlFor={id} className={`${styles['select-btn']} button`}>{buttonText}</label>
          {this.selectDescriber()}
          <button className={`${styles['clear-btn']}`} disabled={!file && !error} onClick={this.clear}>
            <FontAwesomeIcon icon={faXmark} size='1x'/>
          </button>
        </div>
      </div>
    )
  }
}

export default props => <ImageSelector id={useId()} {...props}/>