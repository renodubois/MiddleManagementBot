import { secrets } from '../secrets';

import axios from 'axios';

export const twitchAPI = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  timeout: 1000,
  headers: {'Authorization': `Bearer ${secrets.TWITCH_ACCESS}`}
});

export const legacyTwitchAPI = axios.create({
  baseURL: "https://api.twitch.tv/kraken/",
  timeout: 1000,
  headers: {'Authorization': `Bearer ${secrets.MAIN_TWITCH_ACCESS}`}
})