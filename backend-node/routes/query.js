const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8001';

router.post('/search', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(path.resolve(req.file.path)));

    const response = await axios.post(`${PYTHON_API_URL}/search`, form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(req.file.path);

    return res.json(response.data);

  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Query route error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
