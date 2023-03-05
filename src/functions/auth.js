import axios from 'axios';

const API_BASE_URL ='https://komparcrmserver.onrender.com/api'

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(
    `${API_BASE_URL}/create-or-update-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentUser = async (authtoken) => {
  return await axios.post(
    `${API_BASE_URL}/current-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) => {
  return await axios.post(
    `${API_BASE_URL}/current-admin`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getUsers = async () => await axios.get(`${API_BASE_URL}/users`);
