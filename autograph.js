var AutographRequestMapper = require('./requestMapper');
var uuid = require('node-uuid');
var Autograph = function() { 
	this._configuredProviders = {};
	this.autograph = this;
};

Autograph.connectors = Autograph.prototype.connectors = require('./connectors');
Autograph.prototype.connect = function(wrapped, connector) { 
	for (var cIndex in this.connectors) { 
		var c = this.connectors[cIndex];
		var result = c(this, wrapped);
		if (result) {
			return result;		
		}
	}
	return false;
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
Autograph.prototype.canSignRequest = function(request, opt) { 
	 var providerName = opt.providerName || false;
        var connector = opt.connector || false;
        
 	var requestToSign = connector.mapFrom(request);
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
Autograph.prototype.signRequest = function(request, opt, silent) {
	 
	var providerName = opt.providerName || false;
	var connector = opt.connector || false;
	var requestToSign = connector.mapFrom(request);
	var autographProvider = false;
	if (providerName) {
		autographProvider = this._configuredProviders[providerName];
		if (!autographProvider && !silent)
			throw Error("Invalid Provider Name");
		if (!autographProvider.canSignRequest(requestToSign) && !silent)
			throw Error("Request not supported by provider");	
	} else {
		autographProvider = this.getSupportedProvider(requestToSign);
		if (!autographProvider && !silent)
                        throw Error("No supported providers");
	}
	if (!autographProvider)
		return;
	if (autographProvider.handle401 && connector.setup401Handler)
		connector.setup401Handler(request,autographProvider.handle401);
	var signedRequest = autographProvider.signRequest(requestToSign);
	return connector.mapTo(request,signedRequest);
};

var OAuth1 = require('./providers/oauth1');
var OAuth2 = require('./providers/oauth2');
var Swagger = require('./providers/swagger');

module.exports = Autograph;

Autograph.providers = {};
Autograph.providers.OAuth1 = OAuth1;
Autograph.providers.OAuth2 = OAuth2;
Autograph.providers.SwaggerGenerator = Swagger;
