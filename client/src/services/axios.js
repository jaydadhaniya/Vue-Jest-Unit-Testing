// we first import the axios library
import axios from "axios";

// we also import the auth service from the modules.
import authService from "./auth";
/**
 * Axios basic configuration
 */
const config = {
  baseURL: process.env.VUE_APP_API_BASE_URL,
};

/**
 * Creating the instance of Axios
 * It is because in large-scale application, we may need
 * to consume APIs from more than a single server,
 */
const $axios = axios.create(config);

/**
 * Auth interceptors
 * @description Add auth tokens to every outgoing request.
 * @param {*} config
 */
const authInterceptor = (request) => {
  if (authService.token) {
    request.headers.Authorization = `Bearer ${authService.token}`;
  }
  request.headers["Access-Control-Allow-Origin"] = "*";
  return request;
};

/**
 * Logger interceptors
 * @description Log app requests.
 * @param {*} request
 */
const loggerInterceptor = (request) => {
  /** Add logging here */
  return request;
};

/** Adding the request interceptors */
$axios.interceptors.request.use(authInterceptor);
// $axios.interceptors.request.use(loggerInterceptor);

/** Adding the response interceptors */
$axios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    console.log("Error", error);

    // Event.$emit("error", 500, error.response.data.message);
    // if (error.response.status === 401) authService.logout();
    const errorMessage = error.response && error.response.data && error.response.data.message;
    if (errorMessage) {
      error.response.data.message =
        errorMessage.length > 200
          ? JSON.parse(errorMessage.split("code :").pop()).error.message.split(
              ":"
            )[0]
          : errorMessage;
    }

    throw error;
    // Promise.reject(error);
  }
);

export default $axios;
