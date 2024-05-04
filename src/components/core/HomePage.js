import React from 'react'
import styles from './HomePage.module.css'

const buildExplicitHref = (href) => <a href={href} target='_blank' rel='noopener noreferrer'>{href}</a>

const HomePage = () => {
  return (
    <>
      <div className={styles['description']}>
        <h2>Taras Shevchenko National University of Kyiv</h2>
        <h3>Faculty of Computer Science and Cybernetics</h3>
        <h3>Department of Theory and Technology of Programming</h3>
        <h1>Game Ratings</h1>
  
        <p>
          This web application has been developed as part of a master's qualification work
          <span className={styles['name']}>Web application for video game rating and reviewing</span> <br/>
          (ukr.<span className={styles['name']}>Вебзастосунок для оцінювання та рецензування відеоігор</span>)
          in 2024.
        </p>
        <ul>
          <label>The project consists of 3 parts:</label>
          <li>database <i>mqwdb</i></li>
          <li>server <i>mqwb</i> [GitHub] {buildExplicitHref('https://github.com/GrafKotiakula/mqwb')}</li>
          <li>client <i>mqwf</i> [GitHub] {buildExplicitHref('https://github.com/GrafKotiakula/mqwf')}</li>
        </ul>
        <ul>
          <label>Application has 4 main pages:</label>
          <li>Home page (this page)</li>
          <li>List of games</li>
          <li>Page of the game</li>
          <li>Page of the user</li>
        </ul>
        <p>
          <i>Application requires at least one administrator explicitly entered (granted) in database for propriate work</i>
        </p>
      </div>
      <div className={styles['bottomAnchor']}>

      </div>
    </>
  )
}

export default HomePage