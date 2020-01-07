// $('#name').ready(function(){
//     if ($('#name').text() == '') {
//         $('.stripe-button-el').prop('disabled', true);
//     }
// })
//
// $('#name').change(function(){
//     if ($('#name').text() == '') {
//         $('.stripe-button-el').prop('disabled', true);
//     }
//     else {
//         $('.stripe-button-el').prop('disabled', false);
//     }
// })


$(document).ready(function() {
    let result = {
        name: true,
        address: true,
        phone: true
    };

    if ($('#name').val() == '') {
        result.name = false;
        $('.stripe-button-el').prop('disabled', true);
    };

    if ($('#address').val() == '') {
        result.address = false;
        $('.stripe-button-el').prop('disabled', true);
    };

    if ($('#phone').val() == '' || $('#phone').val().length != 10) {
        result.phone = false;
        $('.stripe-button-el').prop('disabled', true);
    };

    $('#name').keyup(function() {
        if($(this).val() != '') {
            result.name = true;
            if (result.name == true && result.address == true && result.phone == true) {
                $('.stripe-button-el').prop('disabled', false);
            }
        }
        else {
            result.name = false;
            $('.stripe-button-el').prop('disabled', true);
        }
    });

    $('#address').keyup(function() {
        if($(this).val() != '') {
            result.address = true;
            if (result.name == true && result.address == true && result.phone == true) {
                $('.stripe-button-el').prop('disabled', false);
            }
        }
        else {
            result.address = false;
            $('.stripe-button-el').prop('disabled', true);
        }
    });

    $('#phone').keyup(function() {
        if($(this).val() != '' && $(this).val().length == 10) {
            result.phone = true;
            if (result.name == true && result.address == true && result.phone == true) {
                $('.stripe-button-el').prop('disabled', false);
            }
        }
        else {
            result.phone = false;
            $('.stripe-button-el').prop('disabled', true);
        }
    });

 });
