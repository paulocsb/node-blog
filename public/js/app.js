$(document).ready(function() {
	$('form.form-create-post').on('submit', function(e) {
		e.preventDefault();
		const form = $(this);
		$.post('/posts', form.serialize())
		.done(function(data) {
			let alert = $('.alert-success');
			toogleAlert(alert, true);
			alert.find('p').html(data.success);
			form[0].reset();
		})
		.fail(function(error) {
			const responseError = jQuery.parseJSON(error.responseText);
			let alert = $('.alert-danger');
			toogleAlert(alert, false);
			alert.find('p').html(responseError.error);
		});
	});

	$('.alert button.close').on('click', function(e) {
		let alert = $(this.parentElement);
		alert.addClass('hidden');
	});

	const toogleAlert = (el, success) => {
		if(success) {
			if(!$('.alert-danger').hasClass('hidden')) {
				$('.alert-danger').addClass('hidden');
			}
			el.removeClass('hidden');
		} else {
			if(!$('.alert-success').hasClass('hidden')) {
				$('.alert-success').addClass('hidden');
			}
			el.removeClass('hidden');
		}
	}
});