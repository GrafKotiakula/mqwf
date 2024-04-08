import React, { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import LoginContext from './LoginContext';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import GameList from './components/game-list/GameList';
import GamePage from './components/game-page/GamePage';

import { logoutState } from './utils/restApi';

const App = () => {
  const [login, setLogin] = useState(logoutState)
  
  return (
    <BrowserRouter>
      <LoginContext.Provider value={{login: login, setLogin: setLogin}}>
        <main>
          <NavBar />
          <Routes>        
            <Route path='/' element={<div>Home</div>} />
            <Route path='/list' element={<GameList />} />
            <Route path='/game/:id' element={<GamePage />} />
            <Route path='/my-page' element={<div>My page</div>} />
            <Route path='*' element={<Navigate to='/' replace/>} />
          </Routes>
        </main>
        <Footer />
      </LoginContext.Provider>
    </BrowserRouter>
  )
}

export default App