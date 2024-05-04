import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import LoginContext from '../../LoginContext';
import NavBar from './NavBar';
import Footer from './Footer';
import GameList from '../game-list/GameList';
import GamePage from '../game-page/GamePage';
import UserPage from '../user-page/UserPage';

import { useLocalLogin } from '../../utils/storageUtils';
import HomePage from './HomePage';
import GRDataLoader from '../_common/GRDataLoader';

const App = () => {
  const [login, setLogin] = useLocalLogin()
  
  return (
    <BrowserRouter>
      <LoginContext.Provider value={{login: login, setLogin: setLogin}}>
        <main>
          <NavBar />
          <Routes>        
            <Route path='/'         element={<HomePage />} />
            <Route path='/list'     element={<GameList />} />
            <Route path='/game/:id' element={<GamePage />} />
            <Route path='/user/:id' element={<UserPage />} />
            <Route path='*'         element={<GRDataLoader error={400}/>} />
          </Routes>
        </main>
        <Footer />
      </LoginContext.Provider>
    </BrowserRouter>
  )
}

export default App