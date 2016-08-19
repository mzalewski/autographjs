# AutographJS
Simple auth request signing

This library was created to simplify the signing of requests targeting APIs. Currently only basic oAuth 2.0 support but I plan to implement all the major authentication methods.

Providers add support for specific API. Currently only supporting Bitbucket.

For OAuth2, AutographJS requires either an access token or a refresh token. 
While Autograph can refresh expired access tokens (assuming a valid refresh token exists), it does not provide any methods to obtain the refresh/access tokens from an API.
This is because user interaction is required during the authorization step which cannot be supported reliably - Autograph relies on these tokens being provided via another library/method. 

Examples on how to use other libraries to obtain these tokens (eg Passport) will be posted soon.

Basic example:

```js
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

```

