import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import LoginContext from './LoginContext';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import GameList from './components/game-list/GameList';
import GamePage from './components/game-page/GamePage';
import UserPage from './components/user-page/UserPage';

import { useLocalLogin } from './utils/storageUtils';

const App = () => {
  const [login, setLogin] = useLocalLogin()
  
  return (
    <BrowserRouter>
      <LoginContext.Provider value={{login: login, setLogin: setLogin}}>
        <main>
          <NavBar />
          <Routes>        
            <Route path='/' element={<div>Home</div>} />
            <Route path='/list' element={<GameList />} />
            <Route path='/game/:id' element={<GamePage />} />
            <Route path='/user/:id' element={<UserPage />}/>
            <Route path='*' element={<Navigate to='/' replace/>} />
          </Routes>
        </main>
        <Footer />
      </LoginContext.Provider>
    </BrowserRouter>
  )
}

export default App