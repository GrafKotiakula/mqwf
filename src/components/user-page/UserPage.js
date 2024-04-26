import React, { Component } from 'react'

import HttpError from '../_common/GRDataLoader'
import AvatarImage from '../_common/AvatarImage'
import GRDataLoader from '../_common/GRDataLoader'
import PropertyList from '../_common/PropertyList'
import UserPageUpdateForm from './UserPageUpdateForm'

import LoginContext from '../../LoginContext'
import { withRouter } from '../../utils/routingUtils'
import { Role, Status } from "../../api/userRestApi"
import { blockUser as blockUserApi, getUserById, unblockUser as unblockUserApi } from "../../api/userRestApi"
import { formattedDate, hasRole } from '../../utils/dataUtils'

import styles from './UserPage.module.css'
import UPReviewList from './UPReviewList'

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
    this.unblockUser = this.unblockUser.bind(this)
  }

  setUser(user) {
    this.setState({user})
  }

  loadUser(id = this.props.routing?.urlParams?.id) {
    if(id) {
      if(this.context.login?.user?.id == id) {
        this.setState({user: this.context.login.user})
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

  blockUser() {
    this.changeUserStateWiaApi(blockUserApi)
  }

  unblockUser() {
    this.changeUserStateWiaApi(unblockUserApi)
  }

  selectPropsToShow = (user, loginUser) => {
    if(hasRole(loginUser, Role.moderator, Role.admin)) {
      return {
        ID: user?.id,
        Role: user?.role,
        Created: formattedDate(user?.created),
        Status: user?.status
      }
    } else {
      return {
        Role: user?.role,
        Created: formattedDate(user?.created),
      }
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

  blockingButton = (user, loginUser) => {
    if(hasRole(loginUser, Role.moderator, Role.admin) && user?.id !== loginUser?.id) {
      if(user?.status === Status.enabled) {
        return <button className='danger' onClick={this.blockUser}>Block</button>
      } else {
        return <button onClick={this.unblockUser}>Unblock</button>
      }  
    }  
  }  
  
  render() {
    if(this.state.error) {
      return <HttpError error={this.state.error} />
    } else {
      const user = this.state.user
      const loginUser = this.context.login?.user
      return (
        <GRDataLoader loadedClassName={styles['up-content']} isLoaded={this.state.user}>
          <div className={styles['up-header']}>
            <AvatarImage image={user?.image} className={styles['up-image']}/>
            <div className={styles['up-description']}>
              <label className={`${styles['up-description-username']}`}>{user?.username}</label>
              <PropertyList values={this.selectPropsToShow(user, loginUser)}/>
              <div className={styles['up-description-modify']}>
                {(loginUser?.id === user?.id || loginUser?.role === Role.admin) && 
                  <UserPageUpdateForm user={user} onChange={this.setUser}/>
                }
                {this.blockingButton(user, loginUser)}
              </div>
            </div>
          </div>
          <UPReviewList user={user}/>
        </GRDataLoader>
      )
    }
  }
}

export default withRouter(UserPage)