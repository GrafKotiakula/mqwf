import React, { Component } from 'react'

import LoginForm from '../auth/LoginForm'
import SignupForm from '../auth/SignupForm'
import Popup from '../_common/Popup'

import { api } from '../../utils/restApi'

class NavAuthForm extends Component {

  constructor(props){
    super(props)
    this.state = {
      isLogIn: true,
      isVisible: false
    }

    this.setLogIn = this.setLogIn.bind(this)
    this.setSignUp = this.setSignUp.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.setInvisible = this.setInvisible.bind(this)
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

  render() {
    return (
      <div>
        {api.isLogedin() ? 
          <button type='button' onClick={api.logout} className={this.props.className}>Log out</button> :
          <button type='button' onClick={this.setVisible} className={this.props.className}>Log in</button>
        }
        <Popup show={this.state.visible} onClose={this.setInvisible}>
          {this.state.isLogIn ? 
            <LoginForm onSignupCollback={this.setSignUp}/> : 
            <SignupForm onLoginCollback={this.setLogIn}/>
          }
        </Popup>
      </div>
    )
  }
}

export default NavAuthForm