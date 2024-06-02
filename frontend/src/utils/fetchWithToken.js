// src/utils/fetchWithToken.js
export const fetchWithToken = async (url, options = {}, logout) => {
  const token = localStorage.getItem('token');

  const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  };

  try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401 || response.status === 403) {
          if (logout) logout(); // Llamar a la función logout si está definida
          throw new Error('Token no válido');
      }

      return response;
  } catch (error) {
      throw error;
  }
};
