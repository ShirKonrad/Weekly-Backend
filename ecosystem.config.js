module.exports = {
  apps: [
    {
      name: "Weekly-Backend",
      script: "dist/index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
        SERVER_PORT: 3001,
        POSTGRES_PORT: 5432,
        POSTGRES_HOST: "10.10.248.109",
        POSTGRES_DATABASE: "postgres",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "bartar20@CS",
        MICRO_SERVICE_URL: "http://weekly.cs.colman.ac.il:5000",
        SECRET_KEY: "weeklysecret",
        EMAIL: "myyweeklyy@gmail.com",
        EMAIL_PASSWORD: "wknjahuivkcikowe",
        EMAIL_HOST: "193.106.55.109",
        EMAIL_PORT: 587,
      },
      // env_production: {
      //   PORT: 80,
      //   NODE_ENV: "production",
      // },
    },
  ],
};
