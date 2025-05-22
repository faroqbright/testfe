import axios from 'axios';

export const loginUser = async (email, password) => {
  const response = await axios.post('https://testbe-production-59e0.up.railway.app/api/users/login', { email, password });
  return response.data;
};
