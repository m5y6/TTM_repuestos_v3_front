import { fireEvent, render, screen } from "@testing-library/react"
import Carrito from "../pages/Carrito.jsx"
import React from "react"


beforeEach(()=>{
    Storage.prototype.getItem = jest.fn(()=>
        JSON.stringify([])
    )
    Storage.prototype.setItem = jest.fn()
    console.log(JSON.parse(JSON.stringify([])))
})

describe('Carrito Page', ()=>{
    const carritosMock = [
  {
    id: 1,
    nombre: 'Aceite Motor 15W-40',
    precio: 25990,
    descripcion: 'Aceite mineral para motores diésel pesados',
    cantidad: 2,
    imagen: 'img/aceite2.png'
  },
  // ...otros carritos si quieres
];

    it('muestra carrito correctamente', ()=>{
        render(<Carrito productosCarrito={carritosMock} sinHeaderFooter={true} />)
        expect(screen.getByText("1")).toBeInTheDocument()
        expect(screen.getByText("$51.980")).toBeInTheDocument()
        expect(screen.getByText("Aceite Motor 15W-40")).toBeInTheDocument()
    })

})