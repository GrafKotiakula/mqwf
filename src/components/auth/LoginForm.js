import React, { Component } from 'react'

import LabeledInput from '../_common/LabeledInput'

import { isDefined } from '../../utils/varUtils'
import {api, ErrCode} from '../../utils/restApi'

import styles from './form.module.css'

class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      error: null
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()

    let username = this.state.username
    let password = this.state.password
    
    if(!isDefined(username) || username === '') {
      this.setError('Username must not be empty')
    } else if (!isDefined(username) || password === '') {
      this.setError('Password must not be empty')
    } else {
      api.login(username, password)
        .then(r => {
          if(r.status === 200) {
            console.log('Auth success')
          } else if(r.status === 401 && r.json.code === ErrCode.WRONG_USERNAME_OR_PASSWORD) {
            this.setError('Wrong username or password')
          } else {
            Promise.reject(`status: ${r.status}\njson: ${r.json}`)
          }
        })
        .catch(err => {
          console.error(`Unknown error: ${err}`)
          this.setError('Unknown error')
        })
      this.setError(null)
    }
  }

  setError(err) {
    this.setState({
      error: err
    })
  }

  setUsername(username) {
    this.setState({
      username: username
    })
  }

  setPassword(password) {
    this.setState({
      password: password
    })
  }

  render() {
    let {username, passord, error} = this.state
    return (
      <form className={styles['form']} key={this.props.key} onSubmit={this.onSubmit}>
        <LabeledInput label='Username' name='username' type='text' onChange={this.setUsername} value={username}/>
        <LabeledInput label='Password' name='password' type='password' onChange={this.setPassword} value={passord}/>
        {isDefined(error) && <label className={styles['input-error']}>{error}</label>}
        <div className={styles['buttons']}>
          <input type='submit' value='Log in'/>
          <input type='button' value='Sign up' onClick={this.props.onSignupCollback} className='btn-secondary'/>
        </div>
      </form>
    )
  }
}

export default LoginForm