var core = require('autograph-core');
var ProviderList = {};

for (var key in core.Providers) {
         ProviderList[key] = core.Providers[key];
}
ProviderList.addProvider = function(name,provider) {
        ProviderList[name] = provider;
}


module.exports = ProviderList;






