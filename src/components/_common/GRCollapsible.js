import React from 'react'
import Collapsible from 'react-collapsible'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faBan } from "@fortawesome/free-solid-svg-icons"

import styles from './GRCollapsible.module.css'

const triggerOpened = name => (
  <>
    <label>{name}</label>
    <FontAwesomeIcon icon={faChevronUp} size='1x' />
  </>
)

const triggerClosed = name => (
  <>
    <label>{name}</label>
    <FontAwesomeIcon icon={faChevronDown} size='1x' />
  </>
)

const triggerDisabled = name => (
  <>
    <label>{name}</label>
    <FontAwesomeIcon icon={faBan} size='1x'/>
  </>
)

const GRCollapsible = ({
  name, children, disabled, 
  className='', triggerClassName='', 
  triggerDisabledClassName='', contentClassName=''
}) => {
  const __triggerClassName = disabled ? 
    `${triggerDisabledClassName} ${styles['collapsible-trigger']} ${styles['disabled']}` : 
    `${triggerClassName} ${styles['collapsible-trigger']}`
  const __triger = disabled ? triggerDisabled(name) : triggerClosed(name)
  const __triger_open = disabled ? triggerDisabled(name) : triggerOpened(name)
  const __className = `${className} ${styles['collapsible']} ${disabled && styles['disabled']}`
  const __contentClassName = `${contentClassName} ${styles['collapsible-inner']}`

  return (
    <Collapsible triggerTagName='div'
      trigger={__triger}
      triggerWhenOpen={__triger_open}
      
      className={__className} 
      triggerClassName={__triggerClassName} 
      openedClassName={__className}
      triggerOpenedClassName={__triggerClassName}
      contentInnerClassName={__contentClassName}

      triggerDisabled={disabled}
      
    >
      {!disabled && children}
    </Collapsible>
  )
}

export default GRCollapsible
