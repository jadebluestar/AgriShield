import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import your context providers
import { Web3Provider } from './context/Web3Context.jsx'
import { AppProvider } from './context/AppContext.jsx'

console.log("Main.jsx is loading");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3Provider>        {/* Web3Provider must be the outermost */}
      <AppProvider>       {/* AppProvider can now use useWeb3 */}
        <App />
      </AppProvider>
    </Web3Provider>
  </React.StrictMode>,
)