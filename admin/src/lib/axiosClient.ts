import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies(null, { path: '/' });

export const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Accept': 'application/json',
    'Authorization': cookies.get('token') || ""
  }
});