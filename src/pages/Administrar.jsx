import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductoService from "../services/ProductoService";
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

    let promise;

    if (imagenFile) {
      // Si hay un archivo, usamos FormData (multipart/form-data)
      // El backend espera un campo 'producto' con el JSON y un campo 'file' con la imagen.
      const formData = new FormData();
      const producto = { nombre, precio, categoria, description, stock };
      formData.append("producto", JSON.stringify(producto));
      formData.append("file", imagenFile);

      promise = id
        ? ProductoService.updateProductos(id, formData)
        : ProductoService.createProductos(formData);
    } else {
      // Si NO hay archivo, usamos un objeto JSON normal (application/json)
      const producto = { nombre, precio, categoria, description, stock };
      
      promise = id
        ? ProductoService.updateProductos(id, producto)
        : ProductoService.createProductos(producto);
    }

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
    <div>
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
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Imagen:</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImagenChange}
          />
          {id && imagen_url && !imagenFile && <p>Imagen actual: <a href={imagen_url} target="_blank" rel="noopener noreferrer">{imagen_url}</a></p>}
        </div>
        <button type="submit">{id ? "Actualizar" : "Guardar"}</button>
      </form>
    </div>
  );
};

export default Administrar;
