import * as schema from './schema';
import { isUserFollowing } from '../twitch/users';

export function isUserPresent(username: string) : Promise<any> {
  return new Promise((resolve, reject) => {
    schema.User.findOne({ username: username }).then((res) => {
      if (res) {
        return resolve(true);
      }
      return resolve(false);
    }).catch((err) => {
      return reject(err);
    })
  })
}

export function addNewUser(username: string, client: any) : Promise<any> {
  return new Promise(async (resolve, reject) => {
    const newUser = {
      following: false,
      subscriber: false,
      username: username
    };
    // Check to see if the new user is a follower or subscriber
    const isFollowing = await isUserFollowing(username, client);
    newUser.following = isFollowing;

    try {
      await schema.User.create(newUser);
      return resolve('User created successfully!');
    } catch(err) {
      return reject(err);
    }
  })
}