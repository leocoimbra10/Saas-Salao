import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

const Test = () => {
  console.log("Test component rendering!");
  return <h1 style={{ color: 'white', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>HELLO WORLD - REACT IS WORKING</h1>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Test />
  </StrictMode>,
)
