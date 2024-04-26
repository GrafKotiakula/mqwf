import React, { Component } from 'react'

import Popup from '../_common/Popup'
import ImageSelector from '../_common/ImageSelector'
import LabeledInput from '../_common/LabeledInput'
import LabeldSelector from '../_common/LabeledSelector'

import LoginContext from '../../LoginContext'
import { isNotEmptyString } from '../../utils/varUtils'
import { validatePassword, validateRepeatPassword, validateUsername } from '../../utils/validationUtils'
import { isLogedin } from '../../api/authRestApi'
import { Role, updateUser as updateUserApi,
  updateUserImage as updateUserImageApi,
  updateUserPassword as updateUserPasswordApi,
  updateUserRole as updateUserRoleApi } from "../../api/userRestApi"

import styles from './UserPageUpdateForm.module.css'

const maxFileSize = 1024*1024 // 1 MiB

const initValues = props => ({
  username: {
    error: null,
    value: props.user?.username ? props.user.username : ''
  },
  password: {
    error: null,
    value: '',
  },
  repeatPassword: {
    error: null,
    value: '',
  },
  file: null,
  role: props.user?.role
})

export class UserPageUpdateForm extends Component {
  static contextType = LoginContext
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      ...initValues(props)
    }

    this.clear = this.clear.bind(this)
    this.setFile = this.setFile.bind(this)
    this.setRole = this.setRole.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.setInvisible = this.setInvisible.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.setRepeatPassword = this.setRepeatPassword.bind(this)
    this.isFilledOutCorrectly = this.isFilledOutCorrectly.bind(this)
  }

  clear() {
    this.setState(initValues(this.props))
  } 

  setFile(file) {
    this.setState({file})
  }

  setRole(role) {
    this.setState({role: role})
  }
  
  setVisible() {
    this.setState({visible: true})
  }

  setInvisible() {
    this.setState({visible: false})
  }

  setUsername(username) {
    this.setState({
      username: {
        value: username,
        error: validateUsername(username)
      }
    })
  }
  
  setPassword(password) {
    this.setState(prevState => ({
      ...prevState,
      password: {
        error: password === '' ? null : validatePassword(password),
        value: password
      },
      repeatPassword: {
        error: validateRepeatPassword(prevState.repeatPassword.value, password),
        value: prevState.repeatPassword.value
      }
    }))
  }
  
  setRepeatPassword(repeatPassword) {
    this.setState(prevState => ({
      ...prevState,
      repeatPassword: {
        value: repeatPassword,
        error: validateRepeatPassword(repeatPassword, prevState.password.value)
      }
    }))
  }

  isFilledOutCorrectly() {
    const checkProp = ({value, error}, ...except) => except.includes(value) || (!error && isNotEmptyString(value))
    return checkProp(this.state.username) 
        && checkProp(this.state.password, '')
        && this.state.password?.value === this.state.repeatPassword?.value
  }

  sendCallback(user) {
    if(typeof this.props.onChange === 'function') {
      this.props.onChange(user)
    }
  }

  getIdForRequest(user, loginUser) {
    const id = user?.id
    if(id && id === loginUser?.id) {
      return null
    } else {
      return id
    }
  }
  
  updateUser() {
    const {login, setLogin} = this.context
    const user = this.props.user
    const username = this.state.username?.value
    
    if(username && user && isLogedin(login) && this.isFilledOutCorrectly()) {
      const id = this.getIdForRequest(user, login.user)
      updateUserApi({
        ...user,
        username: username
      },
      login, id)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200 && json.username) {
          this.setState({
            username: {
              error: null,
              value: json.username
            }
          })
          console.info('user updated')
          this.sendCallback(json)
        } else if (status === 422 && json.code === ErrorCode.DUPLICATED_FIELD) {
          this.setState(prev => ({
            ...prev,
            username: {
              error: 'Username is already used',
              value: prev.username
            }
          }))
        } else {
          console.error({status, json})
        }
      })
    }
  }

  updatePasswordIfNeed() {
    const {login, setLogin} = this.context
    const user = this.props.user
    const password = this.state.password?.value
    if(password && user && isLogedin(login) && this.isFilledOutCorrectly()) {
      const id = this.getIdForRequest(user, login.user)
      updateUserPasswordApi(password, login, id)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200 && json.username) {
          this.setState({
            password: {
              error: null,
              value: ''
            },
            repeatPassword: {
              error: null,
              value: ''
            }
          })
          console.info('user password updated')
          // callback is unnecessary
        } else {
          console.error({status, json})
        }
      })
    }
  }

  updateImageIfNeed() {
    const {login, setLogin} = this.context
    const user = this.props.user
    const file = this.state.file
    if(file && user && isLogedin(login) && this.isFilledOutCorrectly()) {
      const id = this.getIdForRequest(user, login.user)
      updateUserImageApi(file, login, id)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200 && json.username) {
          this.setState( { file: null } )
          console.info('user image updated')
          this.sendCallback(json)
        } else {
          console.error({status, json})
        }
      })
    }
  }

  updateRoleIfNeed() {
    const {login, setLogin} = this.context
    const user = this.props.user
    const role = this.state.role
    if(user && role !== user.role && role && isLogedin(login) && this.isFilledOutCorrectly()) {
      const id = this.getIdForRequest(user, login.user)
      updateUserRoleApi(id, role, login)
      .then(({status, json, newLogin}) => {
        if(newLogin) {
          setLogin(newLogin)
        }
        if(status === 200 && json.username) {
          this.setState( { role: json.role } )
          console.info('user role updated')
          this.sendCallback(json)
        } else {
          console.error({status, json})
        }
      })
    }
  }
  
  onSubmit(event) {
    event.preventDefault()
    this.updateUser()
    this.updatePasswordIfNeed()
    this.updateImageIfNeed()
    this.updateRoleIfNeed()
  }
  
  render() {
    const {name='Update', user} = this.props
    const {username, password, repeatPassword} = this.state
    const loginUser = this.context?.login?.user
    return (
      <>
        <button onClick={this.setVisible}>{name}</button>
        <Popup show={this.state.visible} onClose={this.setInvisible}>
          <form onSubmit={this.onSubmit} className={styles['form']}>
            {(user?.id === loginUser?.id || loginUser?.role === Role.admin) &&
              <ImageSelector preferedRatio={1} label='Avatar' warn='Image should be square' maxSize={maxFileSize}
                value={this.state.file} onChange={this.setFile}
              />
            }
            {(user?.id === loginUser?.id || loginUser?.role === Role.admin) &&
              <LabeledInput label='Username' name='username' type='text' 
                onChange={this.setUsername} 
                value={username.value}
                error={username.error}
              />
            }
            {(user?.id === loginUser?.id || loginUser?.role === Role.admin) &&
              <LabeledInput label='New password' name='password' type='password'
                onChange={this.setPassword}
                value={password.value}
                error={password.error}
              />
            }
            {(user?.id === loginUser?.id || loginUser?.role === Role.admin) &&
              <LabeledInput label='Repeat password' name='repeatPassword' type='password' 
                onChange={this.setRepeatPassword} 
                value={repeatPassword.value}
                error={repeatPassword.error}
              />
            }
            {user?.id !== loginUser?.id && loginUser?.role === Role.admin &&
              <LabeldSelector label='Role' options={Object.values(Role)} value={this.state.role} onChange={this.setRole}/>
            }
            <div className={styles['buttons']}>
              <input type='submit' value='Save' disabled={!this.isFilledOutCorrectly()}/>
              <button className='btn-secondary' type='button' onClick={this.clear}>Undo</button>
            </div>
          </form>
        </Popup>
      </>
    )
  }
}

export default UserPageUpdateForm