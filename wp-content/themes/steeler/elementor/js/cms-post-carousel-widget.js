( function( $ ) {
    /**
     * @param $scope The Widget wrapper element as a jQuery element
     * @param $ The jQuery alias
     */
    var WidgetCMSPostCarouselHandler = function( $scope, $ ) {
        var breakpoints = elementorFrontend.config.breakpoints;
        var carousel = $scope.find(".cms-slick-carousel");
        var data = carousel.data();
        var slickOptions = {
            slidesToShow: data.slidestoshow,
            slidesToScroll: data.slidestoscroll,
            autoplay: true === data.autoplay,
            autoplaySpeed: data.autoplayspeed,
            infinite: true === data.infinite,
            pauseOnHover: true === data.pauseonhover,
            speed: data.speed,
            centerMode: true === data.centermode,
            centerPadding: data.centerpadding,
            arrows: true === data.arrows,
            dots: true === data.dots,
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
        carousel.slick(slickOptions);

        $scope.find('.filter-item').on('click', function(){
            var data_filter = $(this).data('filter');
            $scope.find('.filter-item').removeClass('active');
            if (typeof data_filter !== "undefined") {
                carousel.slick('slickUnfilter');
                carousel.slick('slickFilter', data_filter);
                $(this).addClass('active');
            } else {
                carousel.slick('slickUnfilter');
            }
        });

    };

    var WidgetServiceCarouselHandler = function( $scope, $ ) {
        var breakpoints = elementorFrontend.config.breakpoints;
        var carousel = $scope.find(".cms-slick-carousel");
        var data = carousel.data();
        var slickOptions = {
            slidesToShow: data.slidestoshow,
            autoplay: true === data.autoplay,
            autoplaySpeed: data.autoplayspeed,
            infinite: true === data.infinite,
            pauseOnHover: true === data.pauseonhover,
            speed: data.speed,
            arrows: true === data.arrows,
            dots: true === data.dots,
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
                }
            }]
        };
        carousel.slick(slickOptions);

        $scope.find('.filter-item').on('click', function(){
            var data_filter = $(this).data('filter');
            console.log(data_filter);
            if (typeof data_filter !== "undefined") {
                carousel.slick('slickUnfilter');
                carousel.slick('slickFilter', data_filter);
            } else {
                carousel.slick('slickUnfilter');
            }
        });
    };

    var WidgetServiceCarouselAnimationHandler = function( $scope, $ ) {
        $scope.find('.cms-lq-project-carousel.layout4 .carousel-item').on('mouseover', function(){
            var background_url = $(this).find('.entry-featured .hover-image img').attr('src');
            var carousel_inner = $scope.find('.cms-lq-project-carousel.layout4 .cms-carousel-inner');
            var carousel_image = $scope.find('.cms-lq-project-carousel.layout4 .cms-carousel-inner .entry-featured');

            $(carousel_image).addClass('image-transparent');
            $(this).find('.entry-featured').addClass('no-border-right');
            $(this).prev().find('.entry-featured').addClass('no-border-right');
            $(carousel_inner).css('background-image', 'url("' + background_url + '")');
        });

        $scope.find('.cms-lq-project-carousel.layout4 .carousel-item').on('mouseleave', function(){
            var carousel_image = $scope.find('.cms-lq-project-carousel.layout4 .cms-carousel-inner .entry-featured');
            $(carousel_image).removeClass('image-transparent');
            $(this).find('.entry-featured').removeClass('no-border-right');
            $(this).prev().find('.entry-featured').removeClass('no-border-right');
        });
    }

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_post_carousel.default', WidgetCMSPostCarouselHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_lq_project_carousel.default', WidgetCMSPostCarouselHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_lq_project_carousel.default', WidgetServiceCarouselAnimationHandler );
        elementorFrontend.hooks.addAction( 'frontend/element_ready/cms_team_carousel.default', WidgetCMSPostCarouselHandler );
    } );
} )( jQuery );