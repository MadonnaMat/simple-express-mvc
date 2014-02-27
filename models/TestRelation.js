	TestRelation = null;
	modelr.push( function(){
		TestRelation = function(id, attrList){
			this.table = "test_relations";
			this.attrs = ['name'];
			this.relations = [
				{
					type: 'one_to_many',
					call: 'test_models',
					foreign_key: 'test_relation_id',
					model: TestModel
				}
			]
			BaseModel.call(this, id, attrList);
		}

		var baseKeys = Object.keys(BaseModel);

		for ( i in baseKeys) {
			TestRelation[baseKeys[i]] = BaseModel[baseKeys[i]];
		}

		TestRelation.prototype = new BaseModel();

		TestRelation.prototype.constructor = BaseModel;

		TestRelation.prototype.test = function(){
			return JSON.stringify(this);
	};
});
