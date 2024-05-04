import React, { Component } from 'react'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import Popup from '../_common/Popup'

import { buildLogoutState, isLoggedin } from "../../api/authRestApi"
import LoginContext from '../../LoginContext'

class NavAuthForm extends Component {

  static contextType = LoginContext

  constructor(props){
    super(props)
    this.state = {
      isLogIn: true,
      visible: false
    }

    this.setLogIn = this.setLogIn.bind(this)
    this.setSignUp = this.setSignUp.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.setInvisible = this.setInvisible.bind(this)
    this.logout = this.logout.bind(this)
  }

  setLogIn() {
    this.setState({
      isLogIn: true,
    })
  }

  setSignUp() {
    this.setState({
      isLogIn: false,
    })
  }

  setVisible() {
    this.setState({visible: true})
  }

  setInvisible() {
    this.setState({visible: false})
  }

  logout() {
    this.context.setLogin(buildLogoutState())
  }

  render() {
    return (
      <div>
        {isLoggedin(this.context.login) ? 
          <button type='button' onClick={this.logout} className={this.props.className}>Log out</button> :
          <button type='button' onClick={this.setVisible} className={this.props.className}>Log in</button>
        }
        <Popup show={this.state.visible} onClose={this.setInvisible}>
          {this.state.isLogIn ? 
            <LoginForm onSignupCallback={this.setSignUp} onLogin={this.setInvisible}/> : 
            <SignupForm onLoginCallback={this.setLogIn} onSignup={this.setInvisible}/>
          }
        </Popup>
      </div>
    )
  }
}

export default NavAuthForm