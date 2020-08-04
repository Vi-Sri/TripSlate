
(function ($) {
    "use strict";
    /*==================================================================[ Validate ]*/

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
        setTimeout($.loadingBlockHide, 2000);
        window.location.href = "/itinerary"
    });


    $(".profile").tooltip({items:'other-title', content: 'test'});
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
        var sloc = $('#sloc').val()
        var eloc = $("#eloc").val()
        var detour = $('#detour').val()
        var duration = $("#duration").val()
        var stime = $('#stime').val()
        var date = $('#date').val()
        data['sloc'] = sloc
        data['eloc'] = eloc
        data['detour'] = detour
        data['duration'] = duration
        data['stime'] = stime
        data['date'] = date
        console.log(data)
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
        setTimeout($.loadingBlockHide, 8000);
        window.location.href = "/itinerary"
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
            if($(input).val().trim() == ''){
                return false;
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