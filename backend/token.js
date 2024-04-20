import express from 'express';
import cors from 'cors';
import { getValidToken } from './getToken.js';

const app = express();
const port = 3001;

app.use(cors()); 

app.get('/token', async (req, res) => {
  try {
    const token = await getValidToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});