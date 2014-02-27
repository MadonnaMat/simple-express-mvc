	TestModel = null;
	modelr.push( function(){
		TestModel = function(id, attrList){
			this.table = "test_models";
			this.attrs = ['val1', 'val2', 'test_relation_id'];
			this.relations = [
				{
					type: 'many_to_one',
					call: 'test_relation',
					attr: 'test_relation_id',
					model: TestRelation
				}
			]
			BaseModel.call(this, id, attrList);
		}

		var baseKeys = Object.keys(BaseModel);

		for ( i in baseKeys) {
			TestModel[baseKeys[i]] = BaseModel[baseKeys[i]];
		}

		TestModel.prototype = new BaseModel();

		TestModel.prototype.constructor = BaseModel;

		TestModel.prototype.test = function(){
		return JSON.stringify(this);
	};
});
