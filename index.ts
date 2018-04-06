import { secrets } from './secrets';
import tmi from 'tmi.js';
import * as mongoose from 'mongoose';
import { addNewUser, isUserPresent } from './db/users';
import { isUserFollowing } from './twitch/users';

interface USERSTATE {
  badges: {
    broadcaster: string,
    subscriber: string,
    premium: string
  },
  color: string,
  'display-name': string,
  emotes: any,
  id: string,
  mod: boolean,
  'room-id': string,
  subscriber: boolean,
  'tmi-sent-ts': string,
  turbo: boolean,
  'user-id': string,
  'user-type': any,
  'emotes-raw': any,
  'badges-raw': string,
  username: string,
  'message-type': string
};

// Connect to DB
mongoose.connect('mongodb://' + secrets.DB_USER + ':' + secrets.DB_PASS + '@ds227199.mlab.com:27199/twitch-bot')
const db = mongoose.connection;
// Wait until we connect to the DB before doing anything else
db.once('open', async () => {
  console.log('Connected to DB!');
  // Init our Twitch client
  let client = new tmi.client({
    channels: ['RenoInMO'],
    connection: {
      reconnect: false
    },
    identity: {
      username: 'MiddleManagementBot',
      password: secrets.TWITCH_OAUTH
    }
  })

  client.connect().then((data: object) => {
    console.log(data)
  }).catch((err: Error) => {
    console.log("Error: ", err)
  })

  client.on("chat", async (channel: string, userstate: USERSTATE, message: string, self: boolean) => {
    if (self) {
      return;
    }

    const followingSplit = message.split("!following ");
    console.log("Following Split: ", followingSplit);
    if (followingSplit.length == 2) {
      try {
        const response = await isUserFollowing(followingSplit[1], client);
        client.say(channel, `Is following: ${response}`);
        return;
      } catch(err) {
        console.log(err);
        client.say(channel, "You errored, you big dummy")
        return;
      }
    }
    client.say(channel, 'Hello world!');
  })

  // On someone entering the channel, create a DB entry if they don't exist already.
  client.on("join", async (channel: string, username: string, self: boolean) => {
    if (self) {
      return;
    }
    // Check to see if we have that user in the database
    try {
      let userExists = await isUserPresent(username);
      if (!userExists) {
        await addNewUser(username, client);
        console.log('Created new user!');
      }
    }
    catch(err) {
      console.log("ERROR: ", err);
    }
  })
})