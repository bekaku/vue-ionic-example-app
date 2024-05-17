import axios, { AxiosInstance } from "axios";
import { DefaultApiCLient, config } from "@/utils/Constant";
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}
const appAxiosInstance = axios.create({
  // baseURL: process.env.NODE_ENV == 'development' ? 'http://192.168.7.249:8080' : 'https://api.example.com',
  baseURL: config.apiBaseUrl,
  withCredentials: false,
  timeout: config.timeOut || 3 * 60000, // 60000 = 1 minute, 0 = no timeout
  headers: {
    // Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept-Apiclient": DefaultApiCLient,
    // 'Accept-Language': DefaultLocale,
  },
  validateStatus: (status) => status <= 500, // Resolve only if the status code is less than 500
});

export default appAxiosInstance;
