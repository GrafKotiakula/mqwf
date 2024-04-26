import React, { Component } from 'react'

import LabeledInput from '../_common/LabeledInput'

import LoginContext from '../../LoginContext'
import { validatePassword, validateRepeatPassword, validateUsername } from '../../utils/validationUtils'
import { isNotEmptyString } from '../../utils/varUtils'
import { buildLoginState } from "../../api/authRestApi"
import { signup } from "../../api/authRestApi"
import ErrorCode from "../../api/ErrorCode"

import styles from './form.module.css'

class SignupForm extends Component {
  
  static contextType = LoginContext
  
  constructor(props) {
    super(props)

    this.state = {
      username: {
        error: null,
        value: ''
      },
      password: {
        error: null,
        value: '',
      },
      repeatPassword: {
        error: null,
        value: '',
      }
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.setRepeatPassword = this.setRepeatPassword.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    console.log(this.context)
    if(this.isFilledOutCorrectly()) {
      const {username: {value: username}, password: {value: password}} = this.state

      signup(username, password)
      .then(({error, status, json}) => {
        if(error || !json) {
          console.log('Sign up error:', {error, json, status})
        } else if(status === 201) { // Created
          const login = buildLoginState({
            username: username,
            password: password,
            jwtToken: json?.token,
            user: json?.user
          })
          this.context.setLogin(login)
          this.props.onSignup(login)
        } else if(status === 422 && json.code === ErrorCode.DUPLICATED_FIELD) {
          this.setState({
            username: {
              value: username,
              error: 'Username is already used'
            }
          })
        } else {
          console.log('Sign up unknown error:', {error, json, status})
        }
      })
    }
  }

  setUsername(username) {
    this.setState({
      username: {
        error: validateUsername(username),
        value: username
      }
    })
  }

  setPassword(password) {
    this.setState(prevState => {
      prevState.password = {
        error: validatePassword(password),
        value: password
      }
      prevState.repeatPassword.error = validateRepeatPassword(prevState.repeatPassword.value, password)
      return prevState
    })
  }

  setRepeatPassword(repeatPassword) {
    this.setState(prevState => {
      prevState.repeatPassword = {
        error: validateRepeatPassword(repeatPassword, prevState.password.value),
        value: repeatPassword
      }
      return prevState
    })
  }

  isFilledOutCorrectly() {
    const checkProp = ({value, error}) => !error && isNotEmptyString(value)
    return checkProp(this.state.username) 
        && checkProp(this.state.password)
        && checkProp(this.state.repeatPassword)
  }

  render() {
    let {username, password, repeatPassword} = this.state
    return (
      <form className={styles['form']} key={this.props.key} onSubmit={this.onSubmit}>
        <LabeledInput label='Username' name='username' type='text' 
          onChange={this.setUsername} 
          value={username.value}
          error={username.error}
        />
        <LabeledInput label='Password' name='password' type='password'
          onChange={this.setPassword}
          value={password.value}
          error={password.error}
        />
        <LabeledInput label='Repeat password' name='repeatPassword' type='password' 
          onChange={this.setRepeatPassword} 
          value={repeatPassword.value}
          error={repeatPassword.error}
        />
        <div className={styles['buttons']}>
          <input type='submit' value='Sign up' disabled={!this.isFilledOutCorrectly()}/>
          <input type='button' value='Log in' onClick={this.props.onLoginCollback} className='btn-secondary'/>
        </div>
      </form>
    )
  }
}

export default SignupForm
