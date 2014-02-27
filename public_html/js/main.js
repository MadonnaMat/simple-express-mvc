$(document).ready( function (){
	$.ajax({
		type: 'GET',
		url: '/TestController/test_get',
		success: function(data){
			$('body').append(data);
		}
	});
});
