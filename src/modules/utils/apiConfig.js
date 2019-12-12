const env = process.env.NODE_ENV || 'development';
const apiEnvironment = {
  development: {
    // api: 'http://18.211.131.166/Audia_Sandbox/api/Audia',
    api: 'https://jsonplaceholder.typicode.com',
    androidSenderID: '444155481972',
  },
  production: {
    // api: 'http://18.211.131.166/Audia_Sandbox/api/Audia',
    api: 'http://18.217.98.59/ratings_dev/public/api',
    androidSenderID: '444155481972',
  },
};
module.exports = apiEnvironment[env];
