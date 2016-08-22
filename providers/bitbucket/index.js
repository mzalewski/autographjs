var BitbucketAutograph = function() {
        this.getDefinition = function() {
                return require('./swagger.json').securityDefinitions;
        };
	this.baseUrl = "https://api.bitbucket.org/2.0";
	var self = this;
	this.OAuth2 = function(opts) { 
	      var OAuth2Autograph = require('../oauth2');
              OAuth2Autograph.call(this,self.baseUrl, self.getDefinition()['oauth2'], opts);
	      this.name = "bitbucket-oauth2";
	}
	this.Basic = function(opts) { 
		var BasicAutograph = require('../basic');
		BasicAutograph.call(this,self.baseUrl, {}, opts);
		this.name = 'bitbucket-basic';
	}
        this.getMethods = function() { return ['OAuth2','Basic']; };
}

module.exports = new BitbucketAutograph;



