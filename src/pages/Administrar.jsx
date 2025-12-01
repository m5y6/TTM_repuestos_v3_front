import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductoService from "../services/ProductoService";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import "../styles/administrar.css";

const Administrar = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [imagen_url, setImagenUrl] = useState(""); // Para mostrar la imagen actual al editar
  const [imagenFile, setImagenFile] = useState(null); // Para el nuevo archivo de imagen

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      ProductoService.getProductoById(id).then((response) => {
        const producto = response.data;
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        setCategoria(producto.categoria);
        setDescription(producto.description);
        setStock(producto.stock);
        setImagenUrl(producto.imagen_url);
      });
    }
  }, [id]);

  const handleImagenChange = (e) => {
    setImagenFile(e.target.files[0]);
  };

  const saveOrUpdateProducto = (e) => {
    e.preventDefault();

    // The backend does not support multipart/form-data for this endpoint.
    // We will always send application/json and ignore the file upload for now.
    const producto = { 
      nombre, 
      precio: parseFloat(precio), 
      categoria, 
      description, 
      stock: parseInt(stock, 10),
      imagen_url // Keep existing image URL when editing
    };
      
    const promise = id
      ? ProductoService.updateProductos(id, producto)
      : ProductoService.createProductos(producto);

    promise
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error al guardar el producto:", error);
        alert(
          "Hubo un error al guardar el producto. Revisa la consola para más detalles."
        );
      });
  };

  return (
    <>
      <Header />
      <main>
        <div className="admin-container">
          <h2>{id ? "Editar Producto" : "Agregar Producto"}</h2>
          <form onSubmit={saveOrUpdateProducto}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Descripción:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Precio:</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Stock:</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Categoría:</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="motor">Motor</option>
                <option value="frenos">Frenos</option>
                <option value="suspension">Suspensión</option>
                <option value="electrico">Eléctrico</option>
                <option value="neumaticos">Neumáticos</option>
                <option value="filtros">Filtros</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label>Imagen:</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                disabled
                title="La subida de imágenes está deshabilitada temporalmente por un problema del backend."
              />
              {id && imagen_url && <p>Imagen actual: <a href={imagen_url} target="_blank" rel="noopener noreferrer">{imagen_url}</a></p>}
            </div>
            <button type="submit">{id ? "Actualizar" : "Guardar"}</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Administrar;
