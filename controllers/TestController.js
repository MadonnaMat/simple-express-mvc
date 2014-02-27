require('../includer.js');

exports.test_post = function(req, res, next){
	res.send('success');
}

exports.test_get = function(req, res, next){
   var toSend = {};
   function for_send(key, send, end){
      toSend[key] = send;
      if(end) {
      	 res.send(JSON.stringify(toSend));
         next();
      }
   }
   TestModel.where({val1: 'test'}, function( testModelArray ) {
      var tma = testModelArray;
      var to_sender = [];
      for(var i in tma){
      	 to_sender[i] = tma[i].return_json();
      }
      for_send('initial_where', to_sender, false);
      var tma_length = tma.length;
      for(var i in tma){
      	 var is_last = false;
      	 if(i == tma.length-1)
      	    is_last = true;
      	 (function(i, is_last){tma[i].test_relation(function(tr){
      	    for_send('in_tma_' + i, tr.return_json(), false);
      	    var count = 0;
      	    function to_for_send(key, value){
      	       count++;
      	       if(count == 2 && is_last)
      	       	  for_send(key, value, true);
      	       else
      	       	  for_send(key, value, false);
      	    }
      	    (function(i){tr.test_models(function(tma2){
      	       var to_sender = [];
      	       for(var j in tma2){
      	       	  to_sender[j] = tma2[j].return_json();
      	       }
      	       to_for_send('in_tma_' + i + '_tr_all', to_sender);
      	    });})(i);
      	    (function(i){tr.test_models.where({val1: ['test', 'test3']}, function(tma2){
      	       var to_sender = [];
      	       for(var j in tma2){
      	       	  to_sender[j] = tma2[j].return_json();
      	       }
      	       to_for_send('in_tma_' + i + '_tr_where', to_sender);
      	    });})(i);
      	    /*tr.test_models.create({val1: 'create_test', val2: 101}, function(tm){
      	       to_for_send('in_tma_' + i + '_tr_create', tm.return_json());
      	    });*/
      	 });})(i, is_last);
      }
   });
}
