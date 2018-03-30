import * as schema from './schema';

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

export function addNewUser(username: string) : Promise<any> {
  return new Promise((resolve, reject) => {
    schema.User.create({ username: username }).then(() => {
      return resolve('User created successfully!');
    }).catch((err) => {
      return reject(err);
    })
  })
}