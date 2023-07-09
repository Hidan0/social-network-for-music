import axios from "axios";
const API_URL = "http://localhost:8080";

export const instance = axios.create({ baseURL: API_URL });
