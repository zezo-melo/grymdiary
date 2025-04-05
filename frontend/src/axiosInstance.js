import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://grym-diary.onrender.com/api',
});


// Interceptador de respostas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
