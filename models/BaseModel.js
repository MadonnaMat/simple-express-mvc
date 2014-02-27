BaseModel = function(id, attrList){
	this.id = id;
	for (i in attrList){
		this[i] = attrList[i];
	}
	var rel = this.relations;
	var self = this;
	for(var i in rel){
		if(rel[i].type == 'many_to_one') {
			this[rel[i].call] = function(callback){
				rel[i].model.find(self[rel[i].attr], callback);
			}
		} else if (rel[i].type == 'one_to_many') {
			this[rel[i].call] = function(callback){
				var val_obj = {};
				val_obj[rel[i].foreign_key] = self.id;
				rel[i].model.where(val_obj, callback);
			}
			this[rel[i].call].where = function(val_obj, callback){
				val_obj[rel[i].foreign_key] = self.id;
				rel[i].model.where(val_obj, callback);
			}
			this[rel[i].call].create = function(val_obj, callback){
				val_obj[rel[i].foreign_key] = self.id;
				rel[i].model.create(val_obj, callback);
			};
		} 
	}
}

BaseModel.create = function(val_obj, callback){
	this.call(this);
	var self = this;
	var query_time = Date.now();
	var query = connection.query("INSERT INTO " + self.table + " SET ?", val_obj, function(err, result){
		console.log('QUERY TIME: ' + (Date.now() - query_time) + 'ms SQL: ' + this.sql)
		callback( new self(result.insertId, val_obj) );
	});
}

BaseModel.find = function(id, callback){
	this.call(this);
	var self = this;
	var query_time = Date.now();
	var query = connection.query("SELECT * FROM " + self.table + " WHERE id = ?", id, function(err, result){
		console.log('QUERY TIME: ' + (Date.now() - query_time) + 'ms SQL: ' + this.sql)
		var val_obj = result[0];
		callback( new self(id, val_obj) );
	});
}

BaseModel.where = function(val_obj, callback){
	this.call(this);
	var self = this;
	var selectArray = [];
	var selectString = ""
	var is_first = true;
	for (i in val_obj){
		selectArray.push(i);
		selectArray.push(val_obj[i]);
		if (!is_first)
			selectString += " AND ";
		else
			is_first = false;
		if(val_obj[i] instanceof Array)
			selectString+= " ?? IN (?) ";
		else
			selectString+= " ?? = ? ";
	}
	var query_time = Date.now();

	var query = connection.query("SELECT * FROM " + self.table + " WHERE " + selectString, selectArray, function(err, result){
		console.log('QUERY TIME: ' + (Date.now() - query_time) + 'ms SQL: ' + this.sql)
		var modelArray = []
		for (i in result){
			modelArray.push(new self(0, result[i]));
		}
		callback( modelArray );
	});
}

BaseModel.prototype.return_json = function(){
	var returner = {}
	for (i in this.attrs){
		returner[this.attrs[i]] = this[this.attrs[i]];
	}
	returner.id = this.id;
	return returner;
}
BaseModel.prototype.destroy = function(callback){
	var self = this;
	callback = callback || function(a){};
	var query_time = Date.now();
	connection.query("DELETE FROM " + self.table + " WHERE id = ?", self.id, function(err, result){
		console.log('QUERY TIME: ' + (Date.now() - query_time) + 'ms SQL: ' + this.sql)
		if (err) 
		{
			callback( err );
		}
		else {
			callback( true );
		}
	});
	for( i in this){
		delete(this[i]);
	}
}
