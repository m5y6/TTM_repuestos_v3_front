import React, { useState, useEffect } from 'react';
import '../styles/Carrito.css';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';

const Carrito = ({carritoActual:carritoActualProp,sinHeaderFooter = false }) => {
    // Variables de estado
    const PRECIO_ENVIO = 5990;
    
    // Códigos de descuento disponibles
    const CODIGOS_DESCUENTO = {
        'FIEL40': { descuento: 15, descripcion: 'Descuento del 15%' },
        'TTM10EMPRE': { descuento: 40, descripcion: 'Descuento de empresa SOPROCAL 40%' }
    };
    
    // Estado inicial de los productos
    const [productos] = useState(carritoActualProp ||[
        {
            id: 1,
            nombre: 'Aceite Motor 15W-40',
            descripcion: 'Aceite mineral para motores diésel pesados',
            precio: 25990,
            cantidad: 2,
            imagen: 'img/aceite2.png'
        },
        {
            id: 2,
            nombre: 'Pastillas de Freno Volvo',
            descripcion: 'Pastillas de freno cerámicas para camiones Volvo',
            precio: 89900,
            cantidad: 1,
            imagen: 'img/pastilla2.png'
        },
        {
            id: 3,
            nombre: 'Llanta 295/80R22.5',
            descripcion: 'Llanta radial para camiones y trailers',
            precio: 245000,
            cantidad: 2,
            imagen: 'img/neumatico2.png'
        }
    ]);
    
    // Estado para resumen
    const [resumen, setResumen] = useState({
        subtotal: 0,
        envio: PRECIO_ENVIO,
        descuento: 0,
        total: 0
    });
    
    // Estado para código de descuento
    const [codigoInput, setCodigoInput] = useState('');
    const [codigoAplicado, setCodigoAplicado] = useState(false);
    const [codigoActual, setCodigoActual] = useState(null);
    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
    const [montoDescuento, setMontoDescuento] = useState(0);
    const [mensajeCodigo, setMensajeCodigo] = useState({ texto: '', tipo: '', mostrar: false });

    // Función para formatear números en formato CLP
    const formatearPrecio = (precio) => {
        return '$' + precio.toLocaleString('es-CL');
    };

    // Función para calcular y actualizar los totales
    const actualizarResumen = () => {
        let subtotal = 0;
        
        // Calcular subtotal sumando todos los productos
        productos.forEach(producto => {
            subtotal += producto.precio * producto.cantidad;
        });
        
        // Calcular envío (gratis para compras superiores a $100.000)
        let envio = PRECIO_ENVIO;
        if (subtotal >= 100000) {
            envio = 0;
        }
        
        // Calcular descuento si hay código aplicado
        let nuevoMontoDescuento = 0;
        if (codigoAplicado && codigoActual) {
            nuevoMontoDescuento = Math.round((subtotal + envio) * (porcentajeDescuento / 100));
        }
        
        setMontoDescuento(nuevoMontoDescuento);
        
        // Calcular total
        const total = subtotal + envio - nuevoMontoDescuento;
        
        // Actualizar el estado
        setResumen({
            subtotal,
            envio,
            descuento: nuevoMontoDescuento,
            total
        });
    };

    // Función para cambiar cantidad
    const cambiarCantidad = (id, operacion) => {
        setProductos(prevProductos => 
            prevProductos.map(producto => {
                if (producto.id === id) {
                    let nuevaCantidad = producto.cantidad;
                    if (operacion === 'incrementar') {
                        nuevaCantidad++;
                    } else if (operacion === 'decrementar' && nuevaCantidad > 1) {
                        nuevaCantidad--;
                    }
                    return { ...producto, cantidad: nuevaCantidad };
                }
                return producto;
            })
        );
    };

    // Función para eliminar producto
    const eliminarProducto = (id) => {
        setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
    };

    // Función para aplicar código de descuento
    const aplicarCodigoDescuento = () => {
        const codigo = codigoInput.trim().toUpperCase();
        
        if (codigo === '') {
            mostrarMensajeCodigo('Por favor ingresa un código', 'error');
            return;
        }
        
        if (CODIGOS_DESCUENTO[codigo]) {
            if (codigoAplicado) {
                mostrarMensajeCodigo('¡El código ya está aplicado!', 'info');
            } else {
                setCodigoAplicado(true);
                setCodigoActual(codigo);
                setPorcentajeDescuento(CODIGOS_DESCUENTO[codigo].descuento);
                
                mostrarMensajeCodigo(
                    `¡Código aplicado! ${CODIGOS_DESCUENTO[codigo].descripcion}`, 
                    'exito'
                );
            }
        } else {
            mostrarMensajeCodigo('Código inválido. Intenta con otro código.', 'error');
        }
    };

    // Función para mostrar mensajes del código
    const mostrarMensajeCodigo = (mensaje, tipo) => {
        setMensajeCodigo({ texto: mensaje, tipo, mostrar: true });
        
        // Ocultar mensaje después de 5 segundos si es de éxito
        if (tipo === 'exito') {
            setTimeout(() => {
                setMensajeCodigo(prev => ({ ...prev, mostrar: false }));
            }, 5000);
        }
    };

    // Función para quitar código de descuento
    const quitarCodigoDescuento = () => {
        setCodigoAplicado(false);
        setCodigoActual(null);
        setPorcentajeDescuento(0);
        setMontoDescuento(0);
        setCodigoInput('');
        setMensajeCodigo({ texto: '', tipo: '', mostrar: false });
    };

    // Función para proceder al pago
    const procederAlPago = () => {
        let mensaje = `¡Gracias por su compra! Total a pagar: ${formatearPrecio(resumen.total)}`;
        
        if (codigoAplicado) {
            mensaje += `\n¡Felicidades! Has ahorrado ${formatearPrecio(montoDescuento)} con el código de descuento.`;
        }
        
        alert(mensaje + '\nSerá redirigido a la página de pago.');
    };

    // Actualizar resumen cuando cambien los productos o el código
    useEffect(() => {
        actualizarResumen();
    }, [productos, codigoAplicado, porcentajeDescuento]);

    // Si no hay productos, mostrar carrito vacío
    if (productos.length === 0) {
        return (
            <div className="carrito-vacio">
                <div className="carrito-vacio-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>¡Explora nuestro catálogo y encuentra las mejores refacciones para tu vehículo!</p>
                <p><a href="catalogo.html">Ver Catálogo</a></p>
            </div>
        );
    }

    return (
        <>
        {!sinHeaderFooter && <Header/>}

        <section className="carrito-simple">
            <h1 className="carrito-titulo">Mi Carrito de Compras</h1>
            
            <div className="carrito-grid">
                <div className="carrito-items">
                    {productos.map(producto => (
                        <div key={producto.id} className="carrito-item" data-precio={producto.precio}>
                            <div className="item-imagen">
                                <img src={producto.imagen} alt={producto.nombre} />
                            </div>
                            <div className="item-info">
                                <h3>{producto.nombre}</h3>
                                <p>{producto.descripcion}</p>
                            </div>
                            <div className="item-precio">
                                {formatearPrecio(producto.precio * producto.cantidad)}
                            </div>
                            <div className="item-cantidad">
                                <button 
                                    className="btn-cantidad"
                                    onClick={() => cambiarCantidad(producto.id, 'decrementar')}
                                >
                                    -
                                </button>
                                <span className="cantidad-numero">{producto.cantidad}</span>
                                <button 
                                    className="btn-cantidad"
                                    onClick={() => cambiarCantidad(producto.id, 'incrementar')}
                                >
                                    +
                                </button>
                            </div>
                            <button 
                                className="btn-eliminar"
                                onClick={() => eliminarProducto(producto.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="resumen-pedido">
                    <h2>Resumen del Pedido</h2>
                    
                    <div className="linea-resumen">
                        <span>Subtotal:</span>
                        <span id="subtotal">{formatearPrecio(resumen.subtotal)}</span>
                    </div>
                    
                    <div className="linea-resumen">
                        <span>Envío:</span>
                        <span 
                            id="envio" 
                            style={resumen.envio === 0 ? { color: '#4caf50', fontWeight: 'bold' } : {}}
                        >
                            {resumen.envio === 0 ? 'GRATIS' : formatearPrecio(resumen.envio)}
                        </span>
                    </div>
                    
                    {codigoAplicado && montoDescuento > 0 && (
                        <div className="linea-resumen descuento-linea" id="descuento-linea">
                            <span>Descuento:</span>
                            <span id="descuento" style={{ color: '#4caf50' }}>
                                -{formatearPrecio(montoDescuento)}
                            </span>
                        </div>
                    )}
                    
                    <div className="linea-total">
                        <span>Total:</span>
                        <span id="total">{formatearPrecio(resumen.total)}</span>
                    </div>
                    
                    {/* Sección de código de descuento */}
                    <div className="codigo-descuento">
                        <div className="input-grupo">
                            <input 
                                type="text" 
                                id="codigo-input" 
                                placeholder="Código de descuento" 
                                maxLength="20"
                                value={codigoInput}
                                onChange={(e) => setCodigoInput(e.target.value)}
                                disabled={codigoAplicado}
                                style={codigoAplicado ? { backgroundColor: '#f0f0f0' } : {}}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        aplicarCodigoDescuento();
                                    }
                                }}
                            />
                            <button 
                                id="aplicar-codigo" 
                                className="btn-aplicar-codigo"
                                onClick={codigoAplicado ? quitarCodigoDescuento : aplicarCodigoDescuento}
                                style={codigoAplicado ? { backgroundColor: '#4caf50' } : {}}
                            >
                                {codigoAplicado ? 'Aplicado ✓' : 'Aplicar'}
                            </button>
                        </div>
                        {mensajeCodigo.mostrar && (
                            <div id="mensaje-codigo" className={`mensaje-codigo ${mensajeCodigo.tipo}`}>
                                {mensajeCodigo.texto}
                            </div>
                        )}
                    </div>
                    
                    <button className="checkout-button" onClick={procederAlPago}>
                        Proceder al Pago
                    </button>
                </div>
            </div>
        </section>

        <Footer/>
        </>
        
    );
};

export default Carrito;