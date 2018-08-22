$(document).ready(function(){
	console.log('hi from ajax!')

	$('.delete-btn').click(function(e){
		e.preventDefault();
		console.log('You want to delete me? ', $(this).attr('href'))

		$.ajax({
			url: $(this).attr('href'),
			method: 'DELETE'
		}).done(function(res){
			console.log('success', res);
			window.location = '/tags'
		}).fail(function(err){
			console.log('fail', err)
		});
	});

	$('#edit-tag').submit(function(e){
		e.preventDefault();
		console.log('about to submit put req')

		$.ajax({
			url: $(this).attr('action'),
			method: 'PUT',
			data: $(this).serialize()
		}).done(function(res){
			console.log('success', res)
		}).fail(function(err){
			console.log('error', err)
		})
	})
});