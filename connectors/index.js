var core = require('autograph-core');
var ConnectorList = {};

for (var key in core.Connectors) {
        ConnectorList[key] = core.Connectors[key];
}
ConnectorList.addConnector = function(name,connector) {
        ConnectorList[name] = connector;
}


module.exports = ConnectorList;
ConnectorList.addConnector("request",require('autograph-connector-request'));






