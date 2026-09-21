( function( $ ) {
    /**
     * @param $scope The Widget wrapper element as a jQuery element
     * @param $ The jQuery alias
     */

    var WidgetCMSItemCarouselHandler = function( $scope, $ ) {
        var breakpoints = elementorFrontend.config.breakpoints;
        var carousel = $scope.find(".cms-slick-carousel");
        var sliderCounter = $scope.find('.slider-counter');
        var slider_nav = $scope.find('.cms-nav-carousel');
        var data = carousel.data();
        if (slider_nav.length === 0) {
            slider_nav = false;
        }
        var slickOptions = {
            slidesToShow: data.slidestoshow,
            slidesToScroll: data.slidestoscroll,
            autoplay: true === data.autoplay,
            autoplaySpeed: data.autoplayspeed,
            infinite: true === data.infinite,
            pauseOnHover: true === data.pauseonhover,
            speed: data.speed,
            centerMode: data.centermode,
            centerPadding: data.centerpadding,
            arrows: true === data.arrows,
            dots: true === data.dots,
            nextArrow: '<span class="slick-next fac fac-arrow-right"></span>',
            prevArrow: '<span class="slick-prev fac fac-arrow-left"></span>',
            asNavFor: slider_nav,
            responsive: [{
                breakpoint: breakpoints.lg,
                settings: {
                    slidesToShow: data.slidestoshowtablet,
                    slidesToScroll: data.slidestoscrolltablet,
                }
            }, {
                breakpoint: breakpoints.md,
                settings: {
                    slidesToShow: data.slidestoshowmobile,
                    slidesToScroll: data.slidestoscrollmobile,
                    centerPadding: '0px',
                }
            }]
        };

        // Nav Count
        if (carousel.length && sliderCounter.length) {
            var currentSlide;
            var slidesCount;
            var updateSliderCounter = function(slick, currentIndex) {
                currentSlide = slick.slickCurrentSlide() + 1;
                slidesCount = slick.slideCount;
                $(sliderCounter).text(currentSlide + ' / ' +slidesCount)
            };

            carousel.on('init', function(event, slick) {
                updateSliderCounter(slick);
            });

            carousel.on('afterChange', function(event, slick, currentSlide) {
                updateSliderCounter(slick, currentSlide);
            });
        }

        // Slick run
        carousel.slick(slickOptions);
        if(typeof carousel.attr('data-centerMode') !== 'undefined') {
            carousel.slick('slickSetOption', 'slidesToScroll', parseInt(carousel.attr('data-slidesToScroll')), true);
        }
        var nav_for = $scope.find(".cms-nav-carousel");
        if(nav_for.length > 0){
            slickOptions.asNavFor = nav_for;
        }

        $('.cms-nav-carousel-arrow').parents('.elementor-element').addClass('hide-nav');

        $('.cms-nav-carousel-left').on('click', function () {
            $(this).parents('.elementor-element').find('.cms-slick-slider .slick-prev').trigger('click');
        });
        $('.cms-nav-carousel-right').on('click', function () {
            $(this).parents('.elementor-element').find('.cms-slick-slider .slick-next').trigger('click');
        });

    };

    $('.cms-slick-slider').each(function () {
        var slider_main = $(this).find('.cms-slick-carousel');
        var slider_nav = $(this).find('.cms-nav-carousel');
        var nav_data = slider_nav.data();
        if(slider_nav.length > 0){
            $(slider_nav).slick({
                slidesToShow: parseInt(slider_nav.attr('data-nav')),
                slidesToScroll: 1,
                asNavFor: slider_main,
                dots: true === nav_data.dots,
                vertical: true === nav_data.vertical,
                verticalSwiping: true === nav_data.verticalSwiping,
                draggable:false,
                centerMode: false,
                focusOnSelect: true,
                infinite: false,
                nextArrow: '<span class="slick-next fac fac-arrow-right"></span>',
                prevArrow: '<span class="slick-prev fac fac-arrow-left"></span>',
                arrows: true === nav_data.navarrows,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });
        }
    });

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_testimonial_carousel.default', WidgetCMSItemCarouselHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_service_carousel.default', WidgetCMSItemCarouselHandler );
    } );
} )( jQuery );