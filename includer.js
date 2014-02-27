var fs = require('fs');

modelr = []

var count = 0;


fs.readdir('./models', function(err, files){
	for (i in files){
		require('./models/' + files[i]);
	}
	afterReading();
});

function afterReading() {

	for ( i in modelr) {
		modelr[i]();
	}
}

fs.readdir('./views', function(err, files){
	for (i in files){
		require('./views/' + files[i]);
	}
});
