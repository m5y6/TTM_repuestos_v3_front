import axios from "axios";
const BASE_URL = "http://localhost:9090/api/productos";
class ProductosService {
  getAllProductos() {
    const token = localStorage.getItem("token");
    return axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getProductoById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
  createProductos(producto) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    return axios.post(BASE_URL, producto, config);
  }
  updateProductos(id, producto) {
    const token = localStorage.getItem('token');
    return axios.put(`${BASE_URL}/${id}`, producto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  deleteProducto(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
export default new ProductosService();
