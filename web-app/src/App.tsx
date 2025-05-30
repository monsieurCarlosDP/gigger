
import './App.css'
import AppProviders from './components/organisms/AppProvider/AppProviders'
import { BrowserRouter, Route, Routes } from 'react-router'

function App() {

  return (
    <>
      <AppProviders>
        <BrowserRouter>
          <Routes>
              <Route
              path={'/'}
              element={<><h1>This is a test</h1></>}/>
              <Route
              path={'/papadopoulos'}
              element={<><h1>Papadopouleame</h1></>} />
          </Routes>
        </BrowserRouter>
      </AppProviders>
  </>
  )
}

export default App
