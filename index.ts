import { secrets } from './secrets';
import * as tmi from 'tmi.js';
import * as mongoose from 'mongoose';
import * as users from './db/users';

// Connect to DB
mongoose.connect('mongodb://' + secrets.DB_USER + ':' + secrets.DB_PASS + '@ds227199.mlab.com:27199/twitch-bot')
const db = mongoose.connection;
// Wait until we connect to the DB before doing anything else
db.once('open', () => {
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
  
  client.on("chat", (channel: string, userstate: object, message: string, self: boolean) => {
    if (self) {
      return;
    }

    if (message === '!garbage') {
      users.isUserPresent('clearlynotarealuser').then((res) => {
        console.log(res);
      }).catch((err: Error) => {
        console.log(err.message);
      })
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
      let userExists = await users.isUserPresent(username);
      if (!userExists) {
        await users.addNewUser(username);
        console.log('Created new user!');
      }
    }
    catch(err) {
      console.log("ERROR: ", err);
    }
  })
})