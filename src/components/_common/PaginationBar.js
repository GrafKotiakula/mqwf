import React from 'react'
import styles from './PaginationBar.module.css'

const generateButton = ({name, value=name, className, disabled=false}) => {
  return (
    <button key={name} 
      className={`${styles['page-bar-button']} ${className} ${name < 10 ? styles['small-page-button'] : ''}`} 
      type='submit' 
      value={value} 
      disabled={disabled} 
      name='page-number'>
        {name}
    </button>
  )
}

const generateSkipLabel = (key) => <label key={key} className={styles['page-bar-skip']}>&#8226;&#8226;&#8226;</label>

const generateNeighbors = (current, neighbors, limit, nextNeighbor, skipKey) => {
  const result = []
  if(current === limit) {
    return result
  }
  let n = current
  for(let i = 0; i < neighbors; ++i) {
    n = nextNeighbor(n)
    if(n !== limit) {
      result.push(generateButton({name: n}))
    } else {
       return result
    }
  }
  if(nextNeighbor(n) !== limit) {
    result.push(generateSkipLabel(skipKey))
  }
  return result
}

const buildOnSubmit = (callBack) => {
  if(typeof callBack === 'function') {
    return (event) => {
      event.preventDefault()
      const value = (event.submitter || event.nativeEvent.submitter).value
      callBack(value)
    }
  } else {
    return undefined
  }
}

const PaginationBar = ({
                    startFrom = 1,
                    count,
                    current = 1, // current page
                    neighbors = 3, // number (max) of current page neighbors to show
                    onSelect,
                    className,
                    hideIfUsless = true
                }) => {
  if(hideIfUsless && count < 2) {
    return <></>
  }
  startFrom = parseInt(startFrom, 10)
  count = parseInt(count, 10)
  current = parseInt(current, 10)
  neighbors = parseInt(neighbors, 10) 
  const onSubmit = buildOnSubmit(onSelect)
  return (
    <form onSubmit={onSubmit} className={`${className} ${styles['page-bar']}`}>
        
        {generateButton({name: '<', value: current-1, className: styles['arrow-button'], disabled: current <= startFrom})}
        
        <div className={`${styles['pages']} invisible-scroll`}>
          {current > startFrom && generateButton({name: startFrom})}
          {current > startFrom && generateNeighbors(current, neighbors, 1, n => n-1, 'skip-l').reverse()}
          <label className={`button ${styles['page-bar-current']} ${ current < 10 ? styles['small-page-button'] : ''}`}>{current}</label>
          {current < count && generateNeighbors(current, neighbors, count, n => n+1, 'skip-r')}
          {current < count && generateButton({name: count})}
        </div>
        
        {generateButton({name: '>', value: current+1, className: styles['arrow-button'], disabled: current >= count})}
    
    </form>
  )
}

export default PaginationBar