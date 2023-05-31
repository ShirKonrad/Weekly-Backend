module.exports = {
  apps: [
    {
      name: "Weekly-Backend",
      script: "src/index.js",
      watch: true,
      env: {
        NODE_ENV: "development",
        SERVER_PORT: 3001,
        POSTGRES_PORT: 5432,
        POSTGRES_HOST: "10.10.248.109",
        POSTGRES_DATABASE: "postgres",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "bartar20@CS",
        MICRO_SERVICE_URL: "http://127.0.0.1:5000",
      },
      env_production: {
        PORT: 80,
        NODE_ENV: "production",
      },
    },
  ],
};
