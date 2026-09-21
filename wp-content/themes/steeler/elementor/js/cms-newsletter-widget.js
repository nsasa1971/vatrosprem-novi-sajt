( function( $ ) {
    /**
     * @param $scope The Widget wrapper element as a jQuery element
     * @param $ The jQuery alias
     */
    var WidgetCMSNewsletterHandler = function( $scope, $ ) {
        $scope.find(".cms-newsletter-form").each(function(){
            /* Newsletter */
            $('.tnp-field-email').find(".tnp-email").each(function (ev) {
                var email_text = $(this).parents('.tnp-field-email').find("label").text();
                $(this).parents('.tnp-field-email').find("label").remove();
                if (!$(this).val()  && email_text != "") {
                    $(this).attr("placeholder", email_text);
                }
            });
            $('.tnp-field-firstname').find(".tnp-firstname").each(function (ev) {
                var firstname_text = $(this).parents('.tnp-field-firstname').find("label").text();
                $(this).parents('.tnp-field-firstname').find("label").remove();
                if (!$(this).val() && firstname_text != "") {
                    $(this).attr("placeholder", firstname_text);
                }
            });
            $('.tnp-field-lastname').find(".tnp-lastname").each(function (ev) {
                var lastname_text = $(this).parents('.tnp-field-lastname').find("label").text();
                $(this).parents('.tnp-field-lastname').find("label").remove();
                if (!$(this).val() && lastname_text != "") {
                    $(this).attr("placeholder", lastname_text);
                }
            });
        });
    };

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_newsletter.default', WidgetCMSNewsletterHandler );
    } );
} )( jQuery );