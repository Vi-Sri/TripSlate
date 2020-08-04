
(function ($) {
    "use strict";
    /*==================================================================
    [ Validate ]*/

     $(document).ajaxStart(function(){
       $.loadingBlockShow({
            imgPath: '/static/images/loading.gif',
            style: {
                position: 'fixed',
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, .8)',
                left: 0,
                top: 0,
                zIndex: 10000
            }
        });
      });

    $(document).ajaxComplete(function(){
        setTimeout($.loadingBlockHide, 5000);
        window.location.href = "/preference"
    });

    var input = $('.validate-input .input100');
    var data = {};
    $('.validate-form').on('submit',function(e){
        e.preventDefault()
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                return false
            }
        }
        var email = $('#email').val()
        var pass = $("#pass").val()
        data['name'] = email
        data['password'] = pass
        $.ajax('/login', {
                type: 'POST',
                header: 'application/json; charset=UTF-8',
                data: data,
                success: function (message) {
                    window.localStorage.setItem("user_cred", message);
                },
                error: function (jqXhr, textStatus, errorMessage) {
                     alert("Error")
                }
            });
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    $('#createAcc').on('click', function(e){
        e.preventDefault()
        var data = {}
        var email = $('#email').val()
        var pass = $("#pass").val()
        console.log(email)
        console.log(pass)
        if ((email != "")&&(pass != "")) {
        var check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check
            data['name'] = email
            data['password'] = pass
            $.ajax('/register', {
                type: 'POST',
                header: 'application/json; charset=UTF-8',
                data: data,
                success: function (data, status, xhr) {
                    alert("Registered, now you can login !!")
                },
                error: function (jqXhr, textStatus, errorMessage) {
                     alert("Error : ",errorMessage)
                }
            });
        }
        else {
            alert("Fill email and password");
        }
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);