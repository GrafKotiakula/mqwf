import React from 'react'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles['footer']}>
      <label>Taras Shevchenko National University of Kyiv</label>
      <label>Faculty of Computer Science and Cybernetics</label>
      <label>Department of Theory and Technology of Programming</label>
      <label>Game Ratings MQWF</label>
      <label>Kyiv-2024</label>
    </footer>
  )
}

export default Footer