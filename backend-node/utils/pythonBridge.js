// backend-node/utils/pythonBridge.js
const axios = require('axios');

const PYTHON_API_BASE_URL = 'http://localhost:8001'; // Adjust if needed

async function registerFace(name, imageBuffer, filename) {
  const FormData = require('form-data');
  const form = new FormData();

  form.append('name', name);
  form.append('image', imageBuffer, {
    filename: filename || 'face.jpg',
    contentType: 'image/jpeg',
  });

  const headers = form.getHeaders();

  try {
    const response = await axios.post(`${PYTHON_API_BASE_URL}/register`, form, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.error('Error registering face:', err.response?.data || err.message);
    throw err;
  }
}

async function recognizeFace(imageBuffer, filename) {
  const FormData = require('form-data');
  const form = new FormData();

  form.append('image', imageBuffer, {
    filename: filename || 'face.jpg',
    contentType: 'image/jpeg',
  });

  const headers = form.getHeaders();

  try {
    const response = await axios.post(`${PYTHON_API_BASE_URL}/recognize`, form, {
      headers,
    });
    return response.data;
  } catch (err) {
    console.error('Error recognizing face:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  registerFace,
  recognizeFace,
};
