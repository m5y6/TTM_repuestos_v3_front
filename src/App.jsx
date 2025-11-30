import { Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Catalogo from './pages/Catalogo'
import Carrito from './pages/Carrito'
import Pedido from './pages/Pedido'
import Envio from './pages/Envio'
import Administrar from './pages/Administrar'
import GlobalNotification from './components/GlobalNotification'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Index />}/>
        <Route path='/registro' element={<Registro />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/catalogo' element={<Catalogo />}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/carrito' element={<Carrito />}/>
          <Route path='/pedido' element={<Pedido />}/>
          <Route path='/envio' element={<Envio />}/>
          <Route path='/administrar' element={<Administrar />}/>
        </Route>
      </Routes>
      <GlobalNotification />
    </>
  )
}

export default App
