;(function ($) {

    "use strict";

    $(document).ready(function () {

        $('.widget_product_search .search-field').find("input[type='text']").each(function (ev) {
            if (!$(this).val()) {
                $(this).attr("placeholder", "Search and Press Enter");
            }
        });

        $('.product-layout-list').parents('ul.products').addClass('products-list');
        $('.single_variation_wrap').addClass('clearfix');
        $('.woocommerce-variation-add-to-cart').addClass('clearfix');

        $('.cart-total-wrap').on('click', function () {
            $('.widget-cart-sidebar').toggleClass('open');
            $(this).toggleClass('cart-open');
            $('.site-overlay').toggleClass('open');
        });

        $('.site-overlay').on('click', function () {
            $(this).removeClass('open');
            $(this).parents('#page').find('.widget-cart-sidebar').removeClass('open');
        });

        $('.woocommerce-tab-heading').on('click', function () {
            $(this).toggleClass('open');
            $(this).parent().find('.woocommerce-tab-content').slideToggle('');
        });

        $('.site-menu-right .h-btn-cart, .mobile-menu-cart .h-btn-cart').on('click', function (e) {
            e.preventDefault();
            $(this).parents('#ct-header-wrap').find('.widget_shopping_cart').toggleClass('open');
            $('.ct-hidden-sidebar').removeClass('open');
            $('.ct-search-popup').removeClass('open');
        });

        //Cart quantity
        $('form.cart .quantity').append('<div class="quantity-icon"><i class="zmdi zmdi-caret-up"></i><i class="zmdi zmdi-caret-down"></i></div>');
        $(document).on('click','.zmdi-caret-up',function(){
            var number = parseInt($(this).parents('.quantity').find('.qty').val());
            if (isNaN(number)) {
                number = 0;
            }
            $(this).parents('.quantity').find('.qty').val(number + 1);
        });
        $(document).on('click','.zmdi-caret-down',function(){
            var number = parseInt($(this).parents('.quantity').find('.qty').val());
            if (isNaN(number)) {
                number = 0;
            }
            if(number >= 1){
                $(this).parents('.quantity').find('.qty').val(number - 1);
            }
        });

    });

})(jQuery);
