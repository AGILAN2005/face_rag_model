require('dotenv').config();
const express = require('express');
const cors = require('cors');

const registerRouter = require('./routes/register');
const queryRouter = require('./routes/query');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/register', registerRouter);
app.use('/api/query', queryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend-node server listening on port ${PORT}`);
});
