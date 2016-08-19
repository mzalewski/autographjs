# AutographJS
Simple auth request signing

This library was created to simplify the signing of requests targeting APIs. Currently only basic oAuth 2.0 support but I plan to implement all the major authentication methods.

Providers add support for specific APIs. (Currently only Bitbucket).

For OAuth2, AutographJS requires either an access token or a refresh token. 
While Autograph can refresh expired access tokens (assuming a valid refresh token exists), it does not provide any methods to obtain the refresh/access tokens from an API.
This is because user interaction is required during the authorization step which cannot be supported reliably - Autograph relies on these tokens being provided via another library/method. 

Examples on how to use other libraries  to obtain these tokens (eg Passport) will be posted soon.

## Goals

 Inspired by Passport, Autograph aims to make signing API requests as simple as possible - once configured, a single call to signRequest should be all that is required to sign any HTTP request. Like Passport, providers will (eventually) be split into their own modules - making it easy to use community-created providers. 

### Features
* Providers - Providers know how to sign a request for a specific API and can determine whether or not they support the specified request. Multiple methods (JWT, OAuth, Basic) can be supported by a single provider. They are designed to be independent and do not rely on any Autograph core functionality - eventually it will be possible to use them without requiring the Autograph library at all (though Autograph will still be useful for managing multiple providers). 
* OAuth Base - If a specific OAuth API is not supported, the generic OAuth provider can be used instead. (Examples coming soon)
* Swagger Compatible - Use the Swagger Provider generator to automatically add support for any OpenAPI/Swagger specification (Examples coming soon)

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

