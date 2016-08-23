var RequestProxy = function(target, RequestClassObject) { 
var extend = require('extend');
// organize params for patch, post, put, head, del
function initParams(uri, options, callback) {
  if (typeof options === 'function') {
    callback = options
  }

  var params = {}
  if (typeof options === 'object') {
    extend(params, options, {uri: uri})
  } else if (typeof uri === 'string') {
    extend(params, {uri: uri})
  } else {
    extend(params, uri)
  }

  params.callback = callback || params.callback
  return params
}

function verbFunc (verb) {
  var method = verb.toUpperCase()
  return function (uri, options, callback) {
    var params = initParams(uri, options, callback)
    params.method = method
    return request(params, params.callback)
  }
}

var request = function(url, opts, callback) { 
	var origRequest = target.Request;
	target.Request = RequestClassObject;
	var result = target.apply(target,arguments);
	target.Request = origRequest;
	return result;
};
for (var key in target) { 
	request[key] = target[key];
}
request.get = verbFunc('get');
request.head = verbFunc('head');
request.post = verbFunc('post');
request.put = verbFunc('put');
request.patch = verbFunc('patch');
request.del = verbFunc('delete');
request['delete'] = verbFunc('delete');


return request;
}
module.exports = RequestProxy;
