import axios from 'axios';

export const loginUser = async (email, password) => {
  const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
  return response.data;
};
