jQuery(function ($) {
    "user strict";

    $(document).on("click", ".redux-container-cms_auto_generate .btn-regenerate", function(e){
    	e.preventDefault();
    	var _this = $(this);
    	var icon = _this.find("i");
    	$.ajax({
            url: ajaxurl,
            type: 'POST',
            beforeSend: function () {
                icon.addClass("fa-spin");
            },
            data: {
                action: 'cms_auto_generate'
            }
        }).done(function (res) {
            _this.parent().find(".cms-auto-generate").val(res.data);
        }).fail(function (res) {
            return false;
        }).always(function (res) {
            icon.removeClass("fa-spin");
            return false;
        });
    });
});