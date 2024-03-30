import './index.css';

import React from 'react';
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import GameList from './components/game-list/GameList';

const rootContainer = ReactDOM.createRoot( document.getElementById('root') )
rootContainer.render(
  <BrowserRouter>
    <main>
      <NavBar />
      <Routes>        
        <Route path='/' element={<div>Home</div>} />
        <Route path='/list' element={<GameList />} />
        {/* <Route path='*' element={<Navigate to='/' replace/>} /> */}
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
)
