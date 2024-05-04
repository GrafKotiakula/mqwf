import React, { useContext } from 'react'

import AvatarImage from '../_common/AvatarImage'
import PropertyList from '../_common/PropertyList'
import UserPageUpdateForm from './UserPageUpdateForm'

import { formattedDate, hasRole } from '../../utils/dataUtils'
import { Role, Status } from '../../api/userRestApi'
import LoginContext from '../../LoginContext'

import styles from './UPHeader.module.css'

const selectPropsToShow = (user, loginUser) => {
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

const blockingButton = (user, loginUser, onBlock) => {
  if(hasRole(loginUser, Role.moderator, Role.admin) && user?.id !== loginUser?.id) {
    if(user?.status === Status.enabled) {
      return <button type='button' className='danger' onClick={() => onBlock(true)}>Block</button>
    } else {
      return <button type='button' onClick={() => onBlock(false)}>Unblock</button>
    }  
  }  
}  

const UPHeader = ({user, onChange, onBlock}) => {
  const loginUser = useContext(LoginContext).login?.user
  return (
    <div className={styles['up-header']}>
      <AvatarImage image={user?.image} className={styles['uph-image']}/>
      <div className={styles['uph-description']}>
        <label className={`${styles['uph-description-username']}`}>{user?.username}</label>
        <PropertyList values={selectPropsToShow(user, loginUser)}/>
        <div className={styles['uph-description-modify']}>
          {(loginUser?.id === user?.id || loginUser?.role === Role.admin) && 
            <UserPageUpdateForm user={user} onChange={onChange}/>
          }
          { blockingButton(user, loginUser, onBlock) }
        </div>
      </div>
    </div>
  )
}

export default UPHeader