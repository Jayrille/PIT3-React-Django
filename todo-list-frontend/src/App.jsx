import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoList from './TodoList';
import './App.css';
import '@fontsource/press-start-2p';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>React TODO App</h1>
      <TodoList/>
    </div>

  );
}

export default App;
