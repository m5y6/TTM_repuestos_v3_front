import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
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
          <Link to="/carrito">Carrito</Link>
          <Link to="/pedido">Pedido</Link>
          <Link to="/envio">Envio</Link>

        </nav>
        
        <div className="botones-auth">
          <Link to="/login" className="boton-inicio">Iniciar Sesión</Link>
          <Link to="/registro" className="boton-registro">Registrarse</Link>
        </div>
      </header>
    </>
  );
}
