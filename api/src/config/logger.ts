import winston from 'winston';
const { createLogger, format, transports, add } = winston;
const { combine, timestamp, label, printf,  } = format;

export const logger = createLogger({
    level: 'info',
    // format: combine(
    //     timestamp({format: 'MM-DD-YYYY HH:mm:ss'}),
    //     printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    // ),
    format: format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: 'logs/error_log.json', level: 'error' }),
        new transports.File({ filename: 'logs/combined_log.json', level: 'info'  }),
        new transports.Console(),
    ]
});