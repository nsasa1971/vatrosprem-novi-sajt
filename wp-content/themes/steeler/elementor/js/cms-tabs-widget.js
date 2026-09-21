( function( $ ) {
    /**
     * @param $scope The Widget wrapper element as a jQuery element
     * @param $ The jQuery alias
     */
    var WidgetCMSTabsHandler = function( $scope, $ ) {
        $scope.find(".cms-tabs .cms-tabs-title .cms-tab-title").on("click", function(e){
            e.preventDefault();
            var target = $(this).data("target");
            var parent = $(this).parents(".cms-tabs");
            parent.find(".cms-tabs-content .cms-tab-content").hide();
            parent.find(".cms-tabs-title .cms-tab-title").removeClass('active');
            $(this).addClass("active");
            $(target).fadeIn('fast');
        });
    };
    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_tabs.default', WidgetCMSTabsHandler );
    } );
} )( jQuery );