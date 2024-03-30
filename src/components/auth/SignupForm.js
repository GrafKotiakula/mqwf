import React, { Component } from 'react'

import LabeledInput from '../_common/LabeledInput'
import { isDefined, isNotEmptyString } from '../../utils/varUtils'

import styles from './form.module.css'

class SignupForm extends Component {
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

    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.setRepeatPassword = this.setRepeatPassword.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    console.log('api.signup')
  }

  validateUsername(username) {
    if(/^\s*$/.test(username)) { // is blank
      return 'Cannot be blank'
    } else if(!/^[a-zA-Z0-9_\-.]*$/.test(username)) { // contains invalid characters (not matches)
      return 'Latin letters, digits, underscores, dashes, dots only'
    } else {
      return null
    }
  }

  setUsername(username) {
    this.setState({
      username: {
        error: this.validateUsername(username),
        value: username
      }
    })
  }

  validatePassword(password) {
    if(password.length < 5) { 
      return 'at least 5 characters'
    } else if (/^[^a-z]*$/.test(password)) {
      return 'must contain lowercased letters'
    } else if (/^[^A-Z]*$/.test(password)) {
      return 'must contain uppercased letters'
    } else if (/^[^0-9]*$/.test(password)) {
      return 'must contain digits'
    } else {
      return null
    }
  }

  setPassword(password) {
    this.setState(prevState => {
      prevState.password = {
        error: this.validatePassword([password]),
        value: password
      }
      prevState.repeatPassword.error = this.validateRepeatPassword(prevState.repeatPassword.value, password)
      return prevState
    })
  }

  validateRepeatPassword(repeatPassword, password) {
    if(password !== repeatPassword) {
      return 'Passwords are not equal'
    } else {
      return null
    }
  }

  setRepeatPassword(repeatPassword) {
    this.setState(prevState => {
      prevState.repeatPassword = {
        error: this.validateRepeatPassword(repeatPassword, prevState.password.value),
        value: repeatPassword
      }
      return prevState
    })
  }

  isFilledOutCorrectly() {
    const checkProp = ({value, error}) => !isDefined(error) && isNotEmptyString(value)
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
          <input type='submit' value='Sign up' />
          <input type='button' value='Log in' onClick={this.props.onLoginCollback} className='btn-secondary'/>
        </div>
      </form>
    )
  }
}

export default SignupForm
