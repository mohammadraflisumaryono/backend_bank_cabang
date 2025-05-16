const { createLogger, format } = require('winston');
const winston = require('winston');
require('winston-daily-rotate-file');
const dayjs = require('dayjs');

const logFormat = format.combine(
	format.timestamp(),
	format.printf(
			info => `${dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')}|${info.message}`
	)
);


const loggerRotate = new (winston.transports.DailyRotateFile) ({
	filename: `logs/api/${dayjs().year()}/${dayjs().format('MMMM')}/log_%DATE%.log`,
	datePattern: 'YYYYMMDD'
});

const logger = createLogger({
	
	level: 'info',
	format: logFormat,
	transports: [
		loggerRotate
	]
});


const logErrRotate = new (winston.transports.DailyRotateFile) ({
	filename: `logs/error/${dayjs().year()}/${dayjs().format('MMMM')}/error_%DATE%.log`,
	datePattern: 'YYYYMMDD'
});

const logError = createLogger({
	level: 'info',
	format: logFormat,
	transports: [
		logErrRotate
	]
});


module.exports = {logger, logError}