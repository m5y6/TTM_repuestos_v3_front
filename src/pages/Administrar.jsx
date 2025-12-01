import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductoService from "../services/ProductoService";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import "../styles/administrar.css";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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

  const uploadToS3 = async (file) => {
    const region = import.meta.env.VITE_AWS_REGION;

    const s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
      },
    });

    const target = {
      Bucket: "ttm-repuestos-imagenes",
      Key: `${Date.now()}_${file.name}`,
      Body: file,
    };

    try {
      const uploader = new Upload({ client: s3Client, params: target });
      await uploader.done();
      const url = `https://${target.Bucket}.s3.${region}.amazonaws.com/${target.Key}`;
      return url;
    } catch (error) {
      console.error("Falló la subida a S3:", error);
      throw error;
    }
  };

  const saveOrUpdateProducto = async (e) => {
    e.preventDefault();

    let imageUrl = imagen_url;

    if (imagenFile) {
      try {
        imageUrl = await uploadToS3(imagenFile);
      } catch (error) {
        alert("La imagen no pudo subirse. El producto no se guardará.");
        return;
      }
    }

    const producto = {
      nombre,
      precio: parseFloat(precio),
      categoria,
      description,
      stock: parseInt(stock, 10),
      imagen_url: imageUrl,
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
                onChange={handleImagenChange}
              />
              {id && imagen_url && (
                <p>
                  Imagen actual:{" "}
                  <a
                    href={imagen_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {imagen_url}
                  </a>
                </p>
              )}
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
