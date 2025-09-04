import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DisplayPageComponent from './components/DisplayPageComponent.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (

    <main className='container h-screen bg-blue-500'>
      <DisplayPageComponent />
    </main>

  )
}

export default App
