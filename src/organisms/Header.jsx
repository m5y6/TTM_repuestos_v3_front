import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Contenido JSX del Header */}
      <header className="primera">
        <div id="logo">
          <img src="/img/logo3.png" alt="logo" />
        </div>

        <nav className="opciones">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo</Link>
          {user && (
            <>
              <Link to="/carrito">Carrito</Link>
              <Link to="/pedido">Pedido</Link>
              <Link to="/envio">Envio</Link>
              {user.roles && user.roles.includes('ROLE_ADMIN') && (
                <Link to="/administrar">Administrar</Link>
              )}
            </>
          )}
        </nav>
        
        <div className="botones-auth">
          {user ? (
            <>
              <span className="usuario-nombre">Hola, {user.nombre}</span>
              <button onClick={logout} className="boton-inicio">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="boton-inicio">Iniciar Sesión</Link>
              <Link to="/registro" className="boton-registro">Registrarse</Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}
