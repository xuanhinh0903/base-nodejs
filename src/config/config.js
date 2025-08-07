const config = {
  logConfig: {
    logFolder: './logs/',
    logFile: 'app.log',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpirationMinutes:
      parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES) || 30,
    refreshExpirationDays:
      parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS) || 7,
  },
};

export default config;
