var	nconf = require('nconf');

nconf.env().argv().file({ file: 'config.json' });

module.exports = {
	port: nconf.get('PORT') || 3000,
	host: nconf.get('HOST') || '127.0.0.1',
	database: nconf.get('database') || 'mongodb://localhost/ametro-editor'
};
