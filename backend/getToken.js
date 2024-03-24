import axios from 'axios';
import qs from 'qs';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env` });

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const encodedData = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

axios({
  method: 'post',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${encodedData}`
  },
  data: qs.stringify({
    'grant_type': 'client_credentials'
  })
})
.then(response => {
  const accessToken = response.data.access_token;
  console.log(accessToken); // Log the access token to the console
})
.catch(error => {
  console.error(error);
});