import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"

import NavAuthForm from './NavAuthForm'
import LoginContext from '../../LoginContext'

import styles from './NavBar.module.css'

const buildNavLinkClass = ({isActive}) => styles['nav-button'] + (isActive ? ` ${styles['selected']}` : '')

class NavBar extends Component {

  static contextType = LoginContext

  constructor(props) {
    super(props)

    this.state = {
        extended: false
    }

    this.onExtensionClick = this.onExtensionClick.bind(this)
  }

  onExtensionClick() {
    this.setState(prev => {
        prev.extended = !prev.extended
        return prev
    })
  }

  render() {
    const {src: logoSrc='/logo.jpg', alt: logoAlt='GR'} = this.props.logo || {}
    const navClasses = styles['nav-content'] + (this.state.extended ? ` ${styles['nav-extended']}` : '')
    return (
      <nav className={styles['nav-bar']}>
        <div className={navClasses}>
          
          <div className={styles['logo']}>
            <img src={process.env.PUBLIC_URL + logoSrc} alt={logoAlt}></img>
            <label>Game Ratings MQWF</label>
            <button className={styles['expansion-button']} onClick={this.onExtensionClick} >
              <FontAwesomeIcon icon={faBars} size='1x'/>
            </button>
          </div>
          
          <div className={styles['route-list']}>
            <NavLink className={buildNavLinkClass} to='/'>
              Home
            </NavLink>
            <NavLink className={buildNavLinkClass} to='/list'>
              List
            </NavLink>
            {this.context.login?.user?.id &&
              <NavLink className={buildNavLinkClass} to={`/user/${this.context.login?.user?.id}`}>
                Me
              </NavLink>
            }
          </div>
          
          <div className={styles['auth']} >
            <NavAuthForm className={styles['nav-button']} />
          </div>
          
        </div>
      </nav>
    )
  }
}

export default NavBar