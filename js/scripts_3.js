$(document).ready(function () {

	var $tab = $('.customer-form-tab'),
		$form = $('.customer-form'),
		$regform = $('.register-button2'),
		$form_wrap = $('.customer-form-container');

	$tab.click(function(){
		$form_wrap.css({'height': 'auto'});
		$tab.toggleClass('active');
		$form.toggleClass('active');
	});

});
