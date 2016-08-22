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
	var self = this;
	this.redirectHandler = function(originalRequest) { 
		var origRedirect = originalRequest._redirect.redirectTo;
		var origOnResponse = originalRequest._redirect.onResponse;
		originalRequest._redirect.onResponse = function(response){
		console.log(response.headers);
			var redirObj = this;
			var newRequest = this.request;
			this.redirectTo = function(response) { 
			if (originalRequest.AutographHandlers && originalRequest.AutographHandlers[response.statusCode] && ! originalRequest.AutographHandlers[response.statusCode].handled ) {
				var mappedRequest = self.mapFrom(originalRequest);
				var req = originalRequest.AutographHandlers[response.statusCode](response,mappedRequest);
				originalRequest.AutographHandlers[response.statusCode].handled = 1;
				var newReq = self.mapTo(newRequest,mappedRequest);
				return newReq.uri;
			}			
			
			return origRedirect.call(redirObj,response);
			};
			return origOnResponse.call(this,response);
		};
	};
	this.mapFrom = function(request) { 
		this.redirectHandler(request);
		var uri = request.uri;
		var mapped = {
			method: request.method,
			qs: querystring.parse(uri.query),
			url: uri.protocol + '//' + uri.host + uri.pathname,
			headers: request.headers,
			statusHandler: {}
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
			console.log("setting header", header);
			originalRequest.setHeader(header.toLowerCase(), newRequest.headers[header]);
		}
		originalRequest.AutographHandlers = newRequest.statusHandler;
		return originalRequest;
	}
}
