var core = require('autograph-core');
var RequestProxy = require('./requestproxy');
var querystring = require('querystring');
function AutographRequestOverride(options) { 
	console.log("calling override")
//	  var monkeypatch = require('monkeypatch');
          AutographRequestOverride.super_.call(this,options);
//	  monkeypatch(this._redirect,'redirectTo',this._autographConnector.handleResponse);
          this._autographConnector.autograph.signRequest(this, this._autographConnector);
}
var RequestConnector = function(autograph,request) {
	if (request == undefined)
		request = require('request');
        this.request = request;
	this.autograph = autograph;
	this.proxyRequest = new RequestProxy(request, AutographRequestOverride);
	require('util').inherits(AutographRequestOverride, request.Request);

        AutographRequestOverride.prototype._autographConnector = this;

};

RequestConnector.prototype = {
	proxy: function() { return this.proxyRequest; },
	handleResponse: function(original, response) {
	self = this, args= arguments;
	var request = response.request;
	if (response.statusCode == "401" && request._autographConnector.error401Handler) { 
		request.num401Handlers = (request.num401Handlers || 0) + 1;
		if (request.num401Handlers > 2) // Only attempt 2x auth redirects
			return original(response);
		var requestObj = request._autographConnector.mapFrom(request);
		var resend = request._autographConnector.error401Handler(response, requestObj);
		if (resend) { 
	 	        request._autographConnector.mapTo(request,resend); 
			var uri = request.uri;
			return uri.protocol + '//' + uri.host + uri.pathname;
			return this.url;
 
		}
	}
	return original(response);

}, setup401Handler:  function(request, handler) { 
	this.error401Handler = handler;
}, mapTo:  function(originalRequest, newRequest) { 
 		if (newRequest.qs)
                for (var key in newRequest.qs) {
                        originalRequest.qs(key,newRequest[key]);
                }
                if (newRequest.headers)
                for (var header in newRequest.headers) {
                        originalRequest.setHeader(header.toLowerCase(), newRequest.headers[header]);
                }
                return originalRequest;

}, mapFrom: function(request) { 
                var uri = request.uri;
                var mapped = {
                        method: request.method,
                        qs: querystring.parse(uri.query),
                        url: uri.protocol + '//' + uri.host + uri.pathname,
                        headers: request.headers
                };
                return mapped;
}
};

core.Connector.subclass(RequestConnector);

RequestConnector.canConnect = function(request) {
        return request.Request && request.get;
}; 
module.exports = RequestConnector.connect;
