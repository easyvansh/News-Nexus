import { useState } from 'react'
import './App.css'
import Header from "./components/Header";
import { BrowserRouter, Route, Router } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
      </BrowserRouter>
    </>
  )
}

export default App
