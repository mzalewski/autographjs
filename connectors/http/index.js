var EventEmitter = require('events').EventEmitter;
class HTTPConnector extends EventEmitter { 
	constructor(autograph, http) { 
		super();
		var util = require('util');
		var url = require('url');
		this.autograph = autograph;
		var baseRequest = http.request;
		http.request = function (options, cb) {
  if (util.isString(options)) {
    options = {
      href: options,
      headers: {}
    };
  } else {
    if (!options.hasOwnProperty('headers')) {
      options.headers = {};
    }
  }
  options = http._autographConnector.autograph.signRequest(options, { connector: http._autographConnector },true);

  var internalRequest = baseRequest(options, cb);
  internalRequest.on('response', function(res) { 
	console.log("GOT CODE", res.statusCode);
  });
  internalRequest.__emit = internalRequest.emit;
  internalRequest.emit = function(eventName, data) { 
	console.log("EVENT",eventName);
	if (true || eventName == "response" || eventName == "close")
	{
		var self = this;
		var args= arguments;
	//setTimeout(function() { 
self.emit.apply(self,args); //}, 0);
		return;
	} 
	this.emit.apply(this,arguments);
	return;
  }
  return internalRequest;
  };
http._autographConnector = this;
}

}
HTTPConnector.create = function(autograph, httpModule) { 
  var selfConnector = this;
  if (httpModule.request && httpModule === require('http'))
  {
    httpModule._autographConnector = new HTTPConnector(autograph, httpModule);
    return httpModule;
  }
  return false;

}

HTTPConnector.prototype.mapTo = function(originalRequest, newRequest) {

		var newUrl = '';
		newUrl += newRequest.url;		
                if (newRequest.qs)
			newUrl += "?" + require('querystring').stringify(newRequest.qs);
		originalRequest.href = newUrl;
		originalRequest.protocol = undefined;
		originalRequest.hostname = undefined;
		originalRequest.path = undefined;
                if (newRequest.headers)
			originalRequest.headers = newRequest.headers;
                return originalRequest;

};
HTTPConnector.prototype.mapFrom = function(request) {
	    var url = request.href || (request.protocol + '//' + request.hostname + request.path);
	    var uri = require('url').parse(url);//request.uri;
                var mapped = {
                        method: request.method || 'GET',
                        qs: require('querystring').parse(uri.query),
                        url: uri.protocol + '//' + uri.host + uri.pathname,
                        headers: request.headers
                };
                return mapped;

};

module.exports = HTTPConnector;
