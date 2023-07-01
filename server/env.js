const path = require('path');

const result = require('dotenv').config({
	path: path.resolve(__dirname, '.env')
});

if (result.error) {
	console.error('[env.js] => Problem in environment configuration...', result.error);
	process.exit(1);
}

module.exports = result.parsed;
