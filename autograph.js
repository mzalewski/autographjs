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

Autograph.prototype.getSupportedProvider = function(requestData) { 
	for (var key in this._configuredProviders) {
		if(this._configuredProviders[key].canSignRequest(requestData))
			return this._configuredProviders[key];
        }
	return null;
}
Autograph.prototype.canSignRequest = function(requestData) { 
	return this.getSupportedProvider(requestData) !== null;
};
Autograph.prototype.signRequest = function(requestData) {
	var autographProvider = this.getSupportedProvider(requestData);
	if (!autographProvider)
		return;
	
	autographProvider.signRequest(requestData);
};

module.exports = Autograph;

