# AutographJS
Simple auth request signing

This library was created to simplify the signing of requests targeting APIs. 
###Auth method support
* Basic 
* Digest
* OAuth 1.0 (incomplete)
* OAuth2
* API Key (incomplete)
* JWT (basic, non-oauth)

Providers add support for specific APIs. (Currently only Bitbucket).

For OAuth2, AutographJS requires either an access token or a refresh token. 
While Autograph can refresh expired access tokens (assuming a valid refresh token exists), it does not provide any methods to obtain the refresh/access tokens from an API.
This is because user interaction is required during the authorization step which cannot be supported reliably - Autograph relies on these tokens being provided via another library/method. 

Examples on how to use other libraries  to obtain these tokens (eg Passport) will be posted soon.

## Goals

 Inspired by Passport, Autograph aims to make signing API requests as simple as possible - once configured, a single call to signRequest should be all that is required to sign any HTTP request. Like Passport, providers will (eventually) be split into their own modules - making it easy to use community-created providers. 

### Features
* Providers - Providers know how to sign a request for a specific API and can determine whether or not they support the specified request. Multiple methods (JWT, OAuth, Basic) can be supported by a single provider. They are designed to be independent and do not rely on any Autograph core functionality - eventually it will be possible to use them without requiring the Autograph library at all (though Autograph will still be useful for managing multiple providers and integrating with request transport libraries). 
* OAuth Base - If a specific OAuth API is not supported, the generic OAuth provider can be used instead. (Examples coming soon)
* Swagger Compatible - Use the Swagger Provider generator to automatically add support for any OpenAPI/Swagger specification (Examples coming soon)

Basic example:

```js
// Set up autograph
var Autograph = require('./index.js');

// Set up bitbucket Provider
var BitbucketAutograph = require('./providers/bitbucket');
Autograph.use(new BitbucketAutograph.OAuth2({
        clientId: 'BITBUCKET_CLIENT_ID',
        clientSecret: 'BITBUCKET_CLIENT_SECRET',
        accessToken: 'BITBUCKET_ACCESS_TOKEN'
}));

// Wrap the request module 
var request = Autograph.connect(require('request'));

// That's it - now send a request and it will be automatically signed
var getRepoRequest = request('https://api.bitbucket.org/2.0/repositories/username',function(error, response) {
        console.log("Response",response.body);
});

```

Digest authentication: 
Digest requires a 401 response from the server before signing can happen - Autograph makes this easy

```js
// Set up autograph
var Autograph = require('./index.js');

// Set up digest Provider
var DigestAutograph = require('./providers/digest');
Autograph.use(new DigestAutograph('https://yourserver.com',{
        userName: 'myUserName',
        password: 'myPassword'
}));

// Wrap the request module 
var request = Autograph.connect(require('request'));

// Send the request - autograph will automatically handle the 401 and then sign the request
var getRepoRequest = request('https://yourserver.com/digest_protected_url',function(error, response) {
        console.log("Response",response.body);
});

```

Custom OAuth2 provider
```js
var OAuth2AutographProvider = require('./providers/oauth2');
// Create a custom OAuth2 provider
var customProvider = new OAuth2AutographProvider("https://api.customurl/v2",{
   tokenUrl: "https://customurl/access_token_url",
   authorizationUrl: "http://customurl/authorization_url",
   clientId: 'myclientid',
   clientSecret: 'myclientsecret',
   accessToken: 'mytoken',
   refreshToken: 'validrefreshtoken'
  });
  // Configure Autograph to use the custom provider
  Autograph.use(customProvider); 
