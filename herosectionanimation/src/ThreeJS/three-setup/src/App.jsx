import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className='App'>
        <header className='App-header'>
          <div class="font-bold text-6xl">hello world</div>
        </header>
      </div>
  );
}

export default App
