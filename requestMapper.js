module.exports = RequestMapper = function() { 
	this.name = "default";
	this.mapFrom = function(request) { 
		return request;
	}
	this.mapTo = function(originalRequest,newRequest) {
		return newRequest;
	}
};

RequestMapper.request = function() { 
	var querystring = require('querystring');
	this.name = "request";
	this.mapFrom = function(request) { 
		var uri = request.uri;
		var mapped = {
			qs: querystring.parse(uri.query),
			url: uri.protocol + '//' + uri.host + uri.pathname,
			headers: request.headers
		};
	return mapped;
				
	};
	this.mapTo = function(originalRequest,newRequest) { 
		if (newRequest.qs)
		for (var key in newRequest.qs) { 
			originalRequest.qs(key,newRequest[key]);
		}
		if (newRequest.headers)
		for (var header in newRequest.headers) { 
			originalRequest.setHeader(header, newRequest.headers[header]);
		}
		return originalRequest;
	}
}
