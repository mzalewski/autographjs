var querystring = require('querystring');
function AutographRequestOverride(options) { 
	  var monkeypatch = require('monkeypatch');
          AutographRequestOverride.super_.call(this,options);
	  monkeypatch(this._redirect,'redirectTo',this._autographConnector.handleResponse);
          this._autographConnector.autograph.signRequest(this, { connector: this._autographConnector },true);
}
var RequestConnector = function(autograph,request) {
        this.request = request;
        this.request._autographConnector = this;
        this.autograph = autograph;
        require('util').inherits(AutographRequestOverride, this.request.Request);

        this.request.Request = AutographRequestOverride;
        AutographRequestOverride.prototype._autographConnector = this;
};
RequestConnector.prototype.handleResponse = function(original, response) {
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

};
RequestConnector.create = function(autograph,original) {
  var selfConnector = this;
  if (typeof original === "function" &&  original.get && original.Request)
  {
    original._autographConnector = new RequestConnector(autograph, original);
    return original;
  }
  return false;

};

RequestConnector.prototype.setup401Handler = function(request, handler) { 
	this.error401Handler = handler;
};
RequestConnector.prototype.mapTo = function(originalRequest, newRequest) { 
 		if (newRequest.qs)
                for (var key in newRequest.qs) {
                        originalRequest.qs(key,newRequest[key]);
                }
                if (newRequest.headers)
                for (var header in newRequest.headers) {
                        originalRequest.setHeader(header.toLowerCase(), newRequest.headers[header]);
                }
                return originalRequest;

};
RequestConnector.prototype.mapFrom = function(request) { 
                var uri = request.uri;
                var mapped = {
                        method: request.method,
                        qs: querystring.parse(uri.query),
                        url: uri.protocol + '//' + uri.host + uri.pathname,
                        headers: request.headers
                };
                return mapped;

};
module.exports = { 
	'request': RequestConnector.create
};
