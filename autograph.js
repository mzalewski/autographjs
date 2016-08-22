var AutographRequestMapper = require('./requestMapper');
var uuid = require('node-uuid');
var Autograph = function() { 
	this._configuredProviders = {};
};
Autograph.prototype.use = function(provider) { 
	var name = provider.name;
	if (!name)
		name = uuid.v4();		
		
	this._configuredProviders[name] = provider;
}
Autograph.prototype.requestMapper = new AutographRequestMapper();
Autograph.prototype.getSupportedProvider = function(request) { 
	for (var key in this._configuredProviders) {
		if(this._configuredProviders[key].canSignRequest(request))
			return this._configuredProviders[key];
        }
	return null;
}
Autograph.prototype.canSignRequest = function(request, providerName) { 
 	var requestToSign = this.requestMapper.mapFrom(request);
        var autographProvider = false;
        if (providerName) {
                autographProvider = this._configuredProviders[providerName];
		if (!autographProvider || !autoGraphProvider.canSignRequest(requestToSign))
			return false;
        } else {
                autographProvider = this.getSupportedProvider(requestToSign);
                if (!autographProvider)
			return false;
        }
	return true;
};
Autograph.prototype.signRequest = function(request, providerName) { 
	var requestToSign = this.requestMapper.mapFrom(request);
	var autographProvider = false;
	if (providerName) {
		autographProvider = this._configuredProviders[providerName];
		if (!autographProvider)
			throw Error("Invalid Provider Name");
		if (!autographProvider.canSignRequest(requestToSign))
			throw Error("Request not supported by provider");	
	} else {
		autographProvider = this.getSupportedProvider(requestToSign);
		if (!autographProvider)
                        throw Error("No supported providers");
	}
	if (autographProvider.handle401)
		this.requestMapper.setup401Handler(request,autographProvider.handle401);
	var signedRequest = autographProvider.signRequest(requestToSign);
	return this.requestMapper.mapTo(request,signedRequest);
};

var OAuth1 = require('./providers/oauth1');
var OAuth2 = require('./providers/oauth2');
var Swagger = require('./providers/swagger');

module.exports = Autograph;

Autograph.providers = {};
Autograph.providers.OAuth1 = OAuth1;
Autograph.providers.OAuth2 = OAuth2;
Autograph.providers.SwaggerGenerator = Swagger;
