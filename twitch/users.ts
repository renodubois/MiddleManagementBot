import { twitchAPI } from './index';
import { secrets } from '../secrets';


export function isUserFollowing(username: string, client: any) : Promise<any> {
  return new Promise(async (resolve, reject) => {
    // Get the user's Twitch ID
    try {
      const userGetConfig = {
        params: {
          login: username
        }
      }
      const response = await twitchAPI.get("/users", userGetConfig);
      const id = response.data.data[0].id;
      const userFollowConfig = {
        params : {
          to_id: secrets.MY_TWITCH_USER_ID,
          from_id: id
        }
      }
      const followResponse = await twitchAPI.get("/users/follows", userFollowConfig);
      const followData = followResponse.data.data[0];
      if (followData) {
        return resolve(true);
      } else {
        return resolve(false);
      }

    } catch(err) {
      console.log(err);
    }
  })
}
