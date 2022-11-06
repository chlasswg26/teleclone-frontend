import axios from "axios";
import { Duration } from "@icholy/duration";
import { parse, stringify } from "qs";

const { REACT_APP_BACKEND_URL, REACT_APP_REQUEST_TIMEOUT } = process.env;
const axiosInstance = axios.create();
const duration = new Duration(REACT_APP_REQUEST_TIMEOUT);

axiosInstance.defaults.baseURL = REACT_APP_BACKEND_URL;
axiosInstance.defaults.timeout = duration.milliseconds();
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.paramsSerializer = {
    parse,
    serialize: (params) => stringify(params, {arrayFormat: 'brackets'})
}

axiosInstance.interceptors.request.use(
  (config) => {
    const isFormDataInstance = config.data instanceof FormData;

    if (!isFormDataInstance) config.data = stringify(config.data);

    const token = localStorage.getItem("@acc_token");

    if (token !== null) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

const AUTHENTICATION_PATH = "/auth";

export const authRegister = async (userData = {}) =>
  await axiosInstance.post(`${AUTHENTICATION_PATH}/register`, userData);
export const authLogin = async (userData = {}) =>
  await axiosInstance.post(`${AUTHENTICATION_PATH}/login`, userData);
export const authLogout = async () =>
  await axiosInstance.get(`${AUTHENTICATION_PATH}/logout`);
export const authGoogle = async () =>
  await axiosInstance.get(`${AUTHENTICATION_PATH}/google`);
