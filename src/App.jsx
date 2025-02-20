import { useState } from 'react'
import MatrixLanding from "./components/MatrixLanding";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MatrixLanding />
  );
}

export default App
