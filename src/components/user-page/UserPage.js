import React, { Component } from 'react'

import GRDataLoader from '../_common/GRDataLoader'

import LoginContext from '../../LoginContext'
import { withRouter } from '../../utils/routingUtils'
import { blockUser as blockUserApi, getUserById, unblockUser as unblockUserApi } from "../../api/userRestApi"

import styles from './UserPage.module.css'
import UPReviewList from './UPReviewList'
import UPHeader from './UPHeader'

export class UserPage extends Component {
  static contextType = LoginContext

  constructor(props) {
    super(props)

    this.state = {
      user: null,
      error: null,
    }

    this.setUser = this.setUser.bind(this)
    this.blockUser = this.blockUser.bind(this)
  }

  setUser(user) {
    this.setState({user})
  }

  loadUser(id = this.props.routing?.urlParams?.id) {
    if(id) {
      if(this.context.login?.user?.id == id) {
        this.setState({user: this.context.login.user, error: null})
      } else {
        getUserById(id)
        .then(({status, json}) => {
          if(status === 200) {
            this.setState({
              user: json, 
              error: null
            })
          } else {
            this.setState({
              user: null,
              error: status
            })
          }
        })
      }
    }
  }

  changeUserStateWiaApi(funcApi) {
    const id = this.state.user?.id
    const login = this.context?.login
    if(id && login) {
      console.log(id, login)
      funcApi(id, login)
      .then(({status, json}) => {
        if(status === 200) {
          this.setState({user: json})
        }
      })
    }
  }

  blockUser(block) {
    if(block) {
      this.changeUserStateWiaApi(blockUserApi)
    } else {
      this.changeUserStateWiaApi(unblockUserApi)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const curUrlId = this.props.routing?.urlParams?.id
    if(prevProps.routing?.urlParams?.id !== curUrlId) {
      this.loadUser(curUrlId)
    }
  }

  componentDidMount() {
    this.loadUser()
  }
  
  render() {
    const {user, error} = this.state
    return (
      <GRDataLoader loadedClassName={styles['up-content']} error={error} isLoaded={user}>
        <UPHeader user={user} onChange={this.setUser} onBlock={this.blockUser}/>
        <UPReviewList user={user}/>
      </GRDataLoader>
    )
  }
}

export default withRouter(UserPage)