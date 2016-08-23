var uuid = require('node-uuid');
var Autograph = function() { 
	this._configuredProviders = {};
	this.autograph = this;
};
Autograph.core = require('autograph-core');
Autograph.prototype.providers = Autograph.providers = require('./providers');
Autograph.prototype.connectors = Autograph.connectors = require('./connectors');



Autograph.prototype.connect = function(wrapped, provider) { 
	for (var cIndex in this.connectors) { 
		var c = this.connectors[cIndex];
		var result = c(provider||this, wrapped);
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
Autograph.prototype.signRequest = function(request, connector) {
	 var requestToSign = request;
	if (connector)
		requestToSign = connector.mapFrom(request);
	var autographProvider = this.getSupportedProvider(requestToSign);
	if (!autographProvider)
		return;
	
	if (autographProvider.handle401 && connector.setup401Handler)
		connector.setup401Handler(request,autographProvider.handle401);

	
	var signedRequest = autographProvider.signRequest(requestToSign);
	if (!connector)
		return signedRequest;
	
	return connector.mapTo(request,signedRequest);
};

module.exports = Autograph;

