// Set up autograph
var Autograph = require('./index.js');

// Use the RequestMapper for the "request" module
var requestMapper = require('./requestMapper.js').request;
Autograph.requestMapper = new requestMapper();

// Set up bitbucket
var BitbucketAutograph = require('./providers/bitbucket');
Autograph.use(bb = new BitbucketAutograph.OAuth2({
	clientId: 'BITBUCKET_CLIENT_ID',
	clientSecret: 'BITBUCKET_CLIENT_SECRET',
	accessToken: 'BITBUCKET_ACCESS_TOKEN'
}));

var request = require('request');

var getRepoRequest = request('https://api.bitbucket.org/2.0/repositories/username',function(error, response) { 
	console.log("Response",response.body); 
});

Autograph.signRequest( getRepoRequest );

