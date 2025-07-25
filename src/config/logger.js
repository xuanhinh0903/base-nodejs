// Import winston logging library
import winston from 'winston';
// Import daily rotate file transport for log rotation
import DailyRotateFile from 'winston-daily-rotate-file';
// Import custom config for log file settings
import config from './config.js';

// Custom format to enumerate error objects for better logging
const enumerateErrorFormat = winston.format(info => {
  if (info.message instanceof Error) {
    // If message is an Error, convert to object with message and stack
    info.message = {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message,
    };
  }

  if (info instanceof Error) {
    // If info itself is an Error, return object with message and stack
    return { message: info.message, stack: info.stack, ...info };
  }

  return info;
});

// Configure daily log file rotation
const transport = new DailyRotateFile({
  filename: config.logConfig.logFolder + config.logConfig.logFile, // Log file path
  datePattern: 'YYYY-MM-DD', // Rotate daily
  zippedArchive: true, // Compress old logs
  maxSize: '20m', // Max size per log file
  maxFiles: '3', // Keep last 3 log files
  prepend: true, // Prepend date to filename
});

// Event listener for log rotation (e.g., upload rotated logs to cloud)
transport.on('rotate', (oldFilename, newFilename) => {
  console.log('oldFilename', oldFilename, 'newFilename', newFilename);
  // call function like upload to s3 or on cloud
});

// Create the logger instance with JSON format and transports
const logger = winston.createLogger({
  format: winston.format.combine(enumerateErrorFormat(), winston.format.json()),
  transports: [
    transport, // Write logs to rotating files
    new winston.transports.Console({
      level: 'info', // Log info and above to console
    }),
  ],
});

// Export the logger for use in other modules
export default logger;
