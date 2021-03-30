var checkoutFields = {
	checkout_feild_inputs: '.checkout_feilds_wrapper select, .checkout_field select, .checkout_field input, .checkout_field textarea',
	ps_checkout_areas: '#checkout-personal-information-step, #checkout-addresses-step, #checkout-delivery-step, #checkout-payment-step',
	ps_checkout_buttons: '.continue, .cart-detailed-actions a, [name=confirm-addresses], [name=confirmDeliveryOption], #payment-confirmation button',

    init : function() {
        //$(".checkout_feilds_wrapper select, .checkout_field select, .checkout_field input, .checkout_field textarea").live('change', function() {
        $(document).on( "change", checkoutFields.checkout_feild_inputs, function() {
			if (!$(this).hasClass('checkout_field_step_address')) {
				var is_checkbox = ($(this).attr('type') == 'checkbox');
				if (is_checkbox) {
					var val = $(this).prop('checked') ? 1 : 0;
				} else {
					var val = $(this).val();
				}

				checkoutFields.save($(this).attr('attr-id'), val);
			}
        });

        /*$(".checkout_field select, .checkout_field input").each(function(){
            checkoutFields.save($(this).attr('attr-id'), $(this).val());
        });*/
		
		//$("#order-detail-content, #opc_new_account, #opc_account, #opc_delivery_methods, #opc_payment_methods").live('click', function(){
        $(document).on( "change", checkoutFields.ps_checkout_areas, function() {
			//var step = checkoutFields.getStep($(this).attr('id'));
			return checkoutFields.checkRequiredFields($(this).attr('id'));
		});
		
		// QY
		$(document).on( "change", "#gx_postcode", function() {
			switch($(this).val()) {
					case "59100":
						$('select[name=city]').val('Roubaix');
						break;
					case "59170":
						$('select[name=city]').val('Croix');
						break;
					case "59200":
						$('select[name=city]').val('Tourcoing');
						break;
					case "59290":
						$('select[name=city]').val('Wasquehal');
						break;
					case "59420":
						$('select[name=city]').val('Mouvaux');
						break;
					case "59510":
						$('select[name=city]').val('Hem');
						break;
					case "59650":
						$('select[name=city]').val("Villeneuve d'Ascq");
						break;
					case "59491":
						$('select[name=city]').val("Villeneuve d'Ascq");
						break;
					case "59390":
						$('select[name=city]').val('Lys-lez-Lannoy');
						break;
					case "59700":
						$('select[name=city]').val('Marcq-en-Barœul');
						break;
					case "59910":
						$('select[name=city]').val('Bondues');
						break;
					case "59370":
						$('select[name=city]').val('Mons-en-baroeul');
						break;

			}
		});
		
		
		$(document).on( "change", "select[name=city]", function() {
			switch($(this).val()) {
					case "Roubaix":
						$('#gx_postcode').val('59100');
						break;
					case "Croix":
						$('#gx_postcode').val('59170');
						break;
					case "Tourcoing":
						$('#gx_postcode').val('59200');
						break;
					case "Wasquehal":
						$('#gx_postcode').val('59290');
						break;
					case "Mouvaux":
						$('#gx_postcode').val('59420');
						break;
					case "Hem":
						$('#gx_postcode').val('59510');
						break;
					case "Villeneuve d'Ascq":
						$('#gx_postcode').val("59650");
						break;
					case "Lys-lez-Lannoy":
						$('#gx_postcode').val('59390');
						break;
					case "Marcq-en-Barœul":
						$('#gx_postcode').val('59700');
						break;
					case "Bondues":
						$('#gx_postcode').val('59910');
						break;
					case "Mons-en-baroeul":
						$('#gx_postcode').val('59370');
						break;

			}
		});
		
		//$('a.button.btn.btn-default.standard-checkout, #order [name="processAddress"], #order [name="processCarrier"], #HOOK_PAYMENT .payment_module a').live('click', function(){
        $(document).on( "click", checkoutFields.ps_checkout_buttons, function() {
			if (typeof($(this).attr('name')) != 'undefined') {
				return checkoutFields.checkRequiredFields($(this).attr('name'));
			} else if (typeof($(this).attr('id')) != 'undefined') {
				return checkoutFields.checkRequiredFields($(this).attr('id'));
			} else {
				return checkoutFields.checkRequiredFields('undefined');
			}

			/* else if (typeof($(this).parents('#HOOK_PAYMENT')) != 'undefined') {
				return checkoutFields.checkRequiredFields('opc_payment_methods');
			} else {
				return checkoutFields.checkRequiredFields('order-detail-content');
			} */
		});
		
		checkoutFields.datePickerInit();
    },
	
	datePickerInit : function() {
		$( ".checkout_field_value.datepicker" ).datepicker({
            //minDate: -20,
            //maxDate: "+3M +10D",
			onSelect: function(dateText) {
				checkoutFields.save($(this).attr('attr-id'), dateText);
			}
        });
	},

    save : function(id, value) {
        $.ajax({
            type: 'POST',
            headers: { "cache-control": "no-cache" },
            url: checkout_fields_controller,
            async: true,
            cache: false,
            dataType : "json",
            data: { id: id, value: value, action: "saveValue" },
            success: function(jsonData)	{
				if (typeof(jsonData.error) == 'undefined') {
					if (jsonData.id) {
						$('#checkout_field_' + id).parents('.checkout_field.required:first').find('label, .checkout_field_desc').css('color', 'green');
					} else {
						$('#checkout_field_' + id).parents('.checkout_field.required:first').find('label, .checkout_field_desc').css('color', 'red');
					}

					//1.6.12 [begin]
					$('#checkout_field_' + id).removeClass('validation_error');
					//1.6.12 [end]
				} else {
					//1.6.12 [begin]
					$('#checkout_field_' + id).addClass('validation_error');
					//1.6.12 [end]

					swal(cf_error_title, jsonData.error, "error");
					$('#checkout_field_' + id).parents('.checkout_field.required:first').find('label, .checkout_field_desc').css('color', 'red');
				}
            }
        });
    },
	
	inArray : function (needle, haystack) {
		var length = haystack.length;
		for(var i = 0; i < length; i++) {
			if(haystack[i] == needle) 
				return true;
		}
		
		return false;
	},	
	
	checkRequiredFields : function(id) {
		if (id == 'undefined' && $('body').attr('id') == 'cart') 
			id = 'cart';
		else if (id == 'undefined' && $('body').attr('id') == 'checkout') 
			id = 'checkout';
		
console.log('ID: ' + id);
		var return_false = false;

		if (checkoutFields.inArray(id, ['cart'])) { //order-detail-content
			$('.checkout_field.required').each(function(i, item){
				var is_checkbox = ($(item).find('.checkout_field_value').attr('type') == 'checkbox');
			    if (!$(item).find('.checkout_field_value').val() || (is_checkbox && !$(item).find('.checkout_field_value').prop('checked')) ) {
					//1.6.12 [begin]
					$(item).find('.checkout_field_value').addClass('validation_error');
					//1.6.12 [end]

					$(item).find('label, .checkout_field_desc').css('color', 'red');
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
			    } else if ($(item).find('.checkout_field_value').hasClass('validation_error')) {
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
				}
			})
		} /*else if (checkoutFields.inArray(id, ['opc_new_account', 'opc_account'])) {
			$('#HOOK_SHOPPING_CART .checkout_field.required, .opc-main-block:first .checkout_field.required').each(function(i, item){
				var is_checkbox = ($(item).find('.checkout_field_value').attr('type') == 'checkbox');
			    if (!$(item).find('.checkout_field_value').val() || (is_checkbox && !$(item).find('.checkout_field_value').prop('checked')) ) {
					//1.6.12 [begin]
					$(item).find('.checkout_field_value').addClass('validation_error');
					//1.6.12 [end]

					$(item).find('label, .checkout_field_desc').css('color', 'red');
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
			    } else if ($(item).find('.checkout_field_value').hasClass('validation_error')) {
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
				}
			})
		}*/ else if (checkoutFields.inArray(id, ['confirmDeliveryOption'])) { //'opc_delivery_methods', 'processCarrier'
			$('#checkout-delivery-step .checkout_field.required').each(function(i, item){
				var is_checkbox = ($(item).find('.checkout_field_value').attr('type') == 'checkbox');
			    if (!$(item).find('.checkout_field_value').val() || (is_checkbox && !$(item).find('.checkout_field_value').prop('checked')) ) {
					//1.6.12 [begin]
					$(item).find('.checkout_field_value').addClass('validation_error');
					//1.6.12 [end]

					$(item).find('label, .checkout_field_desc').css('color', 'red');
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
			    } else if ($(item).find('.checkout_field_value').hasClass('validation_error')) {
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
				}
			})
		} else if (checkoutFields.inArray(id, ['checkout'])) { //opc_payment_methods
			$('.checkout_field.required').each(function(i, item){ //all available `required` fields
				var is_checkbox = ($(item).find('.checkout_field_value').attr('type') == 'checkbox');
			    if (!$(item).find('.checkout_field_value').val() || (is_checkbox && !$(item).find('.checkout_field_value').prop('checked')) ) {
					//1.6.12 [begin]
					$(item).find('.checkout_field_value').addClass('validation_error');
					//1.6.12 [end]

					$(item).find('label, .checkout_field_desc').css('color', 'red');
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
			    } else if ($(item).find('.checkout_field_value').hasClass('validation_error')) {
					swal(cf_error_title, cf_empty_req_field + '"' + $(item).find('label').text() + '"', "error");
					return_false = true;
				}
			})
		}
		
		if (return_false) {
			return false;
		}
		
		return true;
	}
}

//when document is loaded...
$(document).ready(function(){
    checkoutFields.init();
})