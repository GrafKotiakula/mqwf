import React, { Component } from 'react'

import LabeledInput from '../_common/LabeledInput'

import LoginContext from '../../LoginContext'
import { buildLoginState } from "../../api/authRestApi"
import { login } from "../../api/authRestApi"
import ErrorCode from "../../api/ErrorCode"

import styles from './form.module.css'

class LoginForm extends Component {

  static contextType = LoginContext

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
    
    if(!username) {
      this.setError('Username must not be empty')
    } else if (!password) {
      this.setError('Password must not be empty')
    } else {
      this.setError(null)
      login(username, password)
      .then(({status, json}) => {
        if(status === 200) {
          const _login = buildLoginState({
            username: username,
            password: password,
            jwtToken: json?.token,
            user: json?.user
          })
          this.context.setLogin(_login)
          this.props.onLogin(_login)
        } else if (status === 401 && json?.code === ErrorCode.WRONG_USERNAME_OR_PASSWORD) {
          this.setError('Wrong username or password')
        } else if (status === 401 && json?.code === ErrorCode.ACCOUNT_NOT_ENABLED) {
          this.setError('Account is not accessible')
        } else if (status === 600) {
          this.setError('Network error')
        } else {
          this.setError('Unknown error')
        }
      })
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
    const {username, passord, error} = this.state
    const {onSignupCallback} = this.props
    return (
      <form className={styles['form']} key={this.props.key} onSubmit={this.onSubmit}>
        <LabeledInput label='Username' name='username' type='text' onChange={this.setUsername} value={username}/>
        <LabeledInput label='Password' name='password' type='password' onChange={this.setPassword} value={passord}/>
        {error && <label className={styles['input-error']}>{error}</label>}
        <div className={styles['buttons']}>
          <input type='submit' value='Log in'/>
          <input type='button' value='Sign up' onClick={onSignupCallback} className='btn-secondary'/>
        </div>
      </form>
    )
  }
}

export default LoginForm