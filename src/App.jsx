import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BatchFeedsMonitor from './BatchFeedsMonitor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <div>
   <BatchFeedsMonitor />
    
  </div>
    </>
  )
}

export default App
