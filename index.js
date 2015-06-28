require('dotenv').load();
require('babel/register');

require('./app').listen(3000, function() {
    var host = this.address().address;
    var port = this.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
