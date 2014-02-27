var TestObj = function(){
}

TestObj.tester = function(){
	console.log('test 1');
}

TestObj.prototype.tester = function(){
	console.log('test 2');
}

TestObj.tester();

var to = new TestObj();

to.tester();
