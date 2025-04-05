import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptador de respostas
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
