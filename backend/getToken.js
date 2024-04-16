import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env` });

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const encodedData = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

let tokenData = {
  value: null,
  obtainedAt: null
};

const getToken = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedData}`
      },
      data: qs.stringify({
        'grant_type': 'client_credentials'
      })
    });

    tokenData.value = response.data.access_token;
    tokenData.obtainedAt = Date.now();
  } catch (error) {
    console.error(error);
  }
};

const getValidToken = async () => {
  const expiresIn = 30 * 60 * 1000; // 30 minutes in milliseconds

  if (!tokenData.value || Date.now() - tokenData.obtainedAt > expiresIn) {
    await getToken();
  }

  return tokenData.value;
};

export { getValidToken };

getValidToken().then(token => console.log(token));