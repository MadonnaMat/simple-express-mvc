var db_json = require('./db.json');
require('./inflection.js')
var mysql = require('mysql');
var myArgs = require('optimist').argv;

var help = 'This would be a great place for real help information.';

var valid_sql = ['CHAR(n)', 'VARCHAR(n)', 'TINYTEXT', 'TEXT', 'BLOB', 'MEDIUMTEXT', 'MEDIUMBLOB', 'LONGTEXT', 'LONGBLOB', 'TINYINT(n)', 'SMALLINT(n)', 
	'MEDIUMINT(n)', 'INT(n)', 'BIGINT(n)', 'FLOAT', 'DOUBLE(n,n)', 'DECIMAL(n,n)', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'ENUM(a)', 'SET(a)']

connection = mysql.createConnection(db_json);

connection.connect();

if ((myArgs.h)||(myArgs.help)) {
	console.log(help);
	process.exit(0);
}
if((myArgs.m)||(myArgs.model)){
	var arg = myArgs.m||myArgs.model;
	if (arg == arg.pluralize()){
		console.log('Do not pluralize your model name');
	}
	else if(arg.underscore() != arg) {
		console.log('Please underscore your model name');
	} else {
		var tableName = arg.pluralize();
		var className = arg.camelize();
		if(myArgs._.length == 0){
			console.log('No variables set');
		} else {
			console.log('Args: ',  myArgs._);
			var table_c = {};
			var valid = true;
			for(var i in myArgs._){
				var split_string = myArgs._[i].split(':');
				if(split_string.length != 2){
					console.log(myArgs._[i] + ' is not a valid key value pair (example key:value)');
					valid = false;
					break;
				}
				var matcher = split_string[1];
				var matched = matcher.match(/\(([^\)]+)\)$/);
				if(matched !== null) {
					if(matched[1].split(',').length == 1 && !isNaN(parseInt(matched[1].split(',')[0]))) {
						matcher = matcher.replace(/\([^\)]+\)$/, '(n)')
					} else {
						matcher = matcher.replace(/\([^\)]+\)$/, '(a)')
					}
				}
				if (valid_sql.indexOf(matcher) >= 0) {
					table_c[split_string[1]] = split_string[0];
				} else {
					console.log(split_string[1] + ' is not a valid MySql data type');
					valid = false;
					break;
				}
			}
			console.dir(table_c);
		}
	}
}
