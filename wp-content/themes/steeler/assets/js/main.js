(function ($) {
    "use strict";

    /* ===================
         Page reload
         ===================== */
    var scroll_top;
    var window_height;
    var window_width;
    var scroll_status = "";
    var lastScrollTop = 0;
    $(window).on("load", function () {
        $(".cms-loader").fadeOut("slow");
        window_width = $(window).width();
        theme_col_offset();
        steeler_header_sticky();
        steeler_scroll_to_top();
        disable_wow_scrollup();
        wowInit();
    });
    $(window).on("resize", function () {
        window_width = $(window).width();
        theme_col_offset();
    });
    $(window).on("scroll", function () {
        scroll_top = $(window).scrollTop();
        window_height = $(window).height();
        window_width = $(window).width();
        if (scroll_top < lastScrollTop) {
            scroll_status = "up";
        } else {
            scroll_status = "down";
        }
        lastScrollTop = scroll_top;

        steeler_header_sticky();
        steeler_scroll_to_top();
    });

    // Custom Animation
    $('rs-module-wrap').hover(function(){
        $(this).find('.theme-custom2').removeClass("hideonleft");
    }, function() {
        $(this).find('.theme-custom2').addClass("hideonleft");
    });

    $(".cms-fancy-box.layout5").hover(function () {
            var hoverImgID = $(this).find(".image-zoomin-id").text().trim();
            $("#" + hoverImgID).css("overflow", "hidden");
            $("#" + hoverImgID).addClass("imgZoomIn");
        }, function () {
            var hoverImgID = $(this).find(".image-zoomin-id").text().trim();
            $("#" + hoverImgID).removeClass("imgZoomIn");
        }
    );

    if ($('.animation-pulse-scroll-to-icon').length > 0) {
        $(window).scroll(function() {
            var hT = $('.animation-pulse-scroll-to-icon').offset().top,
                hH = $('.animation-pulse-scroll-to-icon').outerHeight(),
                wH = $(window).height(),
                wS = $(this).scrollTop();
            if (wS > (hT+hH-wH) && (hT > wS) && (wS+wH > hT+hH)){
                $('.animation-pulse-scroll-to-icon').find('.elementor-icon').addClass('triggered');
            }
        });
    }

    $.sep_grid_refresh = function () {
        $(".cms-grid-masonry").each(function () {
            var iso = new Isotope(this, {
                itemSelector: ".grid-item",
                percentPosition: true,
                masonry: {
                    columnWidth: ".grid-sizer",
                },
                containerStyle: null,
                stagger: 30,
                sortBy: "name",
            });

            var filtersElem = $(this).parent().find(".grid-filter-wrap");
            filtersElem.on("click", function (event) {
                var filterValue = event.target.getAttribute("data-filter");
                iso.arrange({ filter: filterValue });
            });

            var filterItem = $(this).parent().find(".filter-item");
            filterItem.on("click", function (e) {
                filterItem.removeClass("active");
                $(this).addClass("active");
            });

            var filtersSelect = $(this).parent().find(".select-filter-wrap");
            filtersSelect.change(function () {
                var filters = $(this).val();
                iso.arrange({ filter: filters });
            });

            var orderSelect = $(this).parent().find(".select-order-wrap");
            orderSelect.change(function () {
                var e_order = $(this).val();
                if (e_order == "asc") {
                    iso.arrange({ sortAscending: false });
                }
                if (e_order == "des") {
                    iso.arrange({ sortAscending: true });
                }
            });
        });
    };

    $(document).on("click", ".h-btn-search", function () {
        $(".cms-modal-search").addClass("open");
        setTimeout(function () {
            $('.cms-modal-search input[name="s"]').focus();
        }, 1000);
    });

    // Animation For Layout 7 Side Menu Right Button
    var layout7_side_btn = $(
        ".header-layout7 .site-menu-right-button .menu-right-item"
    );
    var layout7_side_btn_default_width = $(layout7_side_btn)
        .find(".btn-wrapper")
        .width();
    $(layout7_side_btn)
        .find(".btn-wrapper")
        .css("max-width", layout7_side_btn_default_width);
    $(layout7_side_btn)
        .on("mouseover", function () {
            $(this).find(".btn-wrapper").css("width", "100%");
            $(this)
                .find(".btn-wrapper")
                .css("max-width", $(layout7_side_btn).innerWidth());
        })
        .on("mouseleave", function () {
            $(this)
                .find(".btn-wrapper")
                .css("max-width", layout7_side_btn_default_width);
        });

    // load more
    $(".cms-grid").each(function () {
        var _this_wrap = $(this);
        var html_id = _this_wrap.attr("id");
        $(document).on("click", ".cms-load-more", function () {
            var loadmore = $(this).data("loadmore");
            var _this = $(this).parents(".cms-grid");
            var layout_type = _this.data("layout");
            loadmore.paged = parseInt(_this.data("start-page")) + 1;
            var _this_click = $(this);
            _this_click.find("i").attr("class", "fa fa-refresh fa-spin");
            $.ajax({
                url: main_data.ajax_url,
                type: "POST",
                data: {
                    action: "steeler_load_more_post_grid",
                    settings: loadmore,
                },
            })
                .done(function (res) {
                    if (res.status == true) {
                        var html = $("<div></div>").html(res.data.html);
                        html.find(".grid-item").addClass("cms-animated");
                        html = html.html();
                        _this.find(".cms-grid-inner").append(html);
                        _this.data("start-page", res.data.paged);
                        if (layout_type == "masonry") {
                            _this.imagesLoaded(function () {
                                $.sep_grid_refresh();
                            });
                        }
                        if (res.data.paged >= res.data.max) {
                            _this_click.hide();
                        }
                    }
                })
                .fail(function (res) {
                    return false;
                })
                .always(function () {
                    _this_click.find("i").attr("class", "i-hidden");
                    return false;
                });
        });
        // pagination
        $(document).on(
            "click",
            ".cms-grid-pagination .ajax a.page-numbers",
            function () {
                var _this = $(this).parents(".cms-grid");
                var loadmore = _this.find(".cms-grid-pagination").data("loadmore");
                var query_vars = _this.find(".cms-grid-pagination").data("query");
                var layout_type = _this.data("layout");
                var paged = $(this).attr("href");
                paged = paged.replace("#", "");
                loadmore.paged = parseInt(paged);
                query_vars.paged = parseInt(paged);
                // reload pagination
                $.ajax({
                    url: main_data.ajax_url,
                    type: "POST",
                    data: {
                        action: "steeler_get_pagination_html",
                        query_vars: query_vars,
                    },
                })
                    .done(function (res) {
                        if (res.status == true) {
                            _this.find(".cms-grid-pagination").html(res.data.html);
                        }
                    })
                    .fail(function (res) {
                        return false;
                    })
                    .always(function () {
                        return false;
                    });
                // load post
                $.ajax({
                    url: main_data.ajax_url,
                    type: "POST",
                    data: {
                        action: "steeler_load_more_post_grid",
                        settings: loadmore,
                    },
                })
                    .done(function (res) {
                        if (res.status == true) {
                            _this.find(".cms-grid-inner .grid-item").remove();
                            _this.find(".cms-grid-inner").append(res.data.html);
                            _this.data("start-page", res.data.paged);
                            if (layout_type == "masonry") {
                                _this.imagesLoaded(function () {
                                    $.sep_grid_refresh();
                                    $("html, body").animate(
                                        { scrollTop: _this.offset().top - 200 },
                                        "slow"
                                    );
                                });
                            }
                        }
                    })
                    .fail(function (res) {
                        return false;
                    })
                    .always(function () {
                        return false;
                    });
                return false;
            }
        );
    });

    $(document).ready(function () {
        /* =================
                 Menu Dropdown
                 =================== */
        var $menu = $(".main-navigation");
        $menu.find(".primary-menu li").each(function () {
            var $submenu = $(this).find("> ul.sub-menu");
            if ($submenu.length == 1) {
                $(this).hover(
                    function () {
                        if ($submenu.offset().left + $submenu.width() > $(window).width()) {
                            $submenu.addClass("back");
                        } else if ($submenu.offset().left < 0) {
                            $submenu.addClass("back");
                        }
                    },
                    function () {
                        $submenu.removeClass("back");
                    }
                );
            }
        });

        $(".sub-menu .current-menu-item")
            .parents(".menu-item-has-children")
            .addClass("current-menu-ancestor");
        /* =================
                 Menu Mobile
                 =================== */
        $("#main-menu-mobile .open-menu").on("click", function () {
            $(this).toggleClass("opened");
            $(".site-navigation").toggleClass("navigation-open");
        });

        /* ===================
                 Search Toggle
                 ===================== */
        $(".popup-contact-button").click(function (e) {
            e.preventDefault();
            $(".cms-modal-contact-form").removeClass("remove").toggleClass("open");
        });

        $(".cms-close").click(function (e) {
            e.preventDefault();
            $(this).parent().addClass("remove").removeClass("open");
            $(this).parents(".cms-widget-cart-wrap").removeClass("open");
            $(this).parents(".cms-modal").addClass("remove").removeClass("open");
            $(this).parents("#page").find(".site-overlay").removeClass("open");
        });

        /* ===================
                 Slide Nav Toggle
                 ===================== */
        $(".icon-slide-nav span").on("click", function (e) {
            e.preventDefault();
            $("body").addClass("js_nav");
        });
        $(".cms-close-slide").on("click", function (e) {
            e.preventDefault();
            $("body").removeClass("js_nav");
        });

        /* Video 16:9 */
        $(".entry-video iframe").each(function () {
            var v_width = $(this).width();

            v_width = v_width / (16 / 9);
            $(this).attr("height", v_width + 35);
        });
        /* Images Light Box - Gallery:True */
        $(".images-light-box").each(function () {
            $(this).magnificPopup({
                delegate: "a.light-box",
                type: "image",
                gallery: {
                    enabled: true,
                },
                mainClass: "mfp-fade",
            });
        });

        /* ====================
                 Scroll To Top
                 ====================== */
        $(".scroll-top").click(function () {
            $("html, body").animate({ scrollTop: 0 }, 800);
            return false;
        });

        /* =================
                Add Class
                =================== */
        $(".wpcf7-select").parent().addClass("wpcf7-menu");

        /* Select */
        $("select:not(.combobox)").each(function () {
            $(this).niceSelect();
        });

        /* Newsletter */
        $(".tnp-field-email")
            .find(".tnp-email")
            .each(function (ev) {
                var email_text = $(this)
                    .parents(".tnp-field-email")
                    .find("label")
                    .text();
                $(this).parents(".tnp-field-email").find("label").remove();
                if (!$(this).val() && email_text != "") {
                    $(this).attr("placeholder", email_text);
                }
            });
        $(".tnp-field-firstname")
            .find(".tnp-firstname")
            .each(function (ev) {
                var firstname_text = $(this)
                    .parents(".tnp-field-firstname")
                    .find("label")
                    .text();
                $(this).parents(".tnp-field-firstname").find("label").remove();
                if (!$(this).val() && firstname_text != "") {
                    $(this).attr("placeholder", firstname_text);
                }
            });
        $(".tnp-field-lastname")
            .find(".tnp-lastname")
            .each(function (ev) {
                var lastname_text = $(this)
                    .parents(".tnp-field-lastname")
                    .find("label")
                    .text();
                $(this).parents(".tnp-field-lastname").find("label").remove();
                if (!$(this).val() && lastname_text != "") {
                    $(this).attr("placeholder", lastname_text);
                }
            });

        /* Mobile Menu */
        $(".main-navigation li.menu-item-has-children").append(
            '<span class="main-menu-toggle"></span>'
        );
        $(".main-menu-toggle").on("click", function () {
            $(this).parent().find("> .sub-menu").toggleClass("submenu-open");
            $(this).parent().find("> .sub-menu").slideToggle();
        });

        $(".cms-hidden-close, .cms-menu-close").on("click", function (e) {
            e.preventDefault();
            $(this).parent().removeClass("open");
            $(this).parents(".cms-hidden-sidebar").removeClass("open");
        });

        $(document).on("click", function (e) {
            if (e.target.className == "cms-modal cms-modal-search open") {
                $(".cms-modal-search").removeClass("open");
            }
            if (e.target.className == "cms-modal cms-modal-contact-form open") {
                $(".cms-modal-contact-form").removeClass("open");
            }
            if (e.target.className == "cms-modal-close") {
                $(e.target).parents(".cms-modal").removeClass("open");
            }
            if (e.target.className == "cms-hidden-sidebar open")
                $(".cms-hidden-sidebar").removeClass("open");
        });
    });

    /* =================
         Column Absolute
         =================== */
    function theme_col_offset() {
        var e_row_space_lg = ($("#content").width() - 1200) / 2;
        if (window_width > 1200) {
            $(
                "body:not(.rtl) .col-offset-left > .elementor-column-wrap > .elementor-widget-wrap"
            ).css("padding-left", e_row_space_lg + "px");
            $(
                "body:not(.rtl) .col-offset-right > .elementor-column-wrap > .elementor-widget-wrap"
            ).css("padding-right", e_row_space_lg + "px");

            $(
                ".rtl .col-offset-left > .elementor-column-wrap > .elementor-widget-wrap"
            ).css("padding-right", e_row_space_lg + "px");
            $(
                ".rtl .col-offset-right > .elementor-column-wrap > .elementor-widget-wrap"
            ).css("padding-left", e_row_space_lg + "px");
        }
    }

    function steeler_header_sticky() {
        var offsetTop = $("#site-header-wrap").outerHeight();
        var h_header = $(".fixed-height").outerHeight();
        var offsetTopAnimation = offsetTop + 200;
        if ($("#site-header-wrap").hasClass("is-sticky")) {
            if (scroll_top > offsetTopAnimation) {
                $("#site-header").addClass("h-fixed");
            } else {
                $("#site-header").removeClass("h-fixed");
            }
        }
        if (window_width > 992) {
            $(".fixed-height").css({
                height: h_header,
            });
        }
    }

    /* Hidden Sidebar */
    $(".h-btn-sidebar").on("click", function (e) {
        e.preventDefault();
        $(".cms-hidden-sidebar").toggleClass("open");
    });

    /* Cart Sidebar */
    $(".h-btn-cart").on("click", function (e) {
        e.preventDefault();
        $(".cms-widget-cart-wrap").toggleClass("open");
        $(".cms-header-navigation").removeClass("navigation-open");
        $(this).parents("body").addClass("ov-hidden");
    });

    /* ====================
         Scroll To Top
         ====================== */
    function steeler_scroll_to_top() {
        if (scroll_top < window_height) {
            $(".scroll-top").addClass("off").removeClass("on");
        }
        if (scroll_top > window_height) {
            $(".scroll-top").addClass("on").removeClass("off");
        }
    }
    function disable_wow_scrollup() {
        var $window = $(window),
            scrolled = $window.scrollTop();
        $(".animate-time").each(function (index) {
            $(this)
                .find("> .grid-item > .wow")
                .each(function (index, obj) {
                    var $this = $(this);
                    var offsetTop = $this.outerHeight();
                    if (offsetTop < scrolled) {
                        $(this).removeClass("wow animated");
                    }
                });
        });
    }

    function wowInit() {
        /* =================
                 Animate Time
                 =================== */
        $(".animate-time").each(function () {
            var eltime = 100;
            var elt_inner = $(this).children().length;
            var _elt = elt_inner - 1;
            $(this)
                .find("> .grid-item > .wow")
                .each(function (index, obj) {
                    $(this).css("animation-delay", eltime + "ms");
                    if (_elt === index) {
                        eltime = 100;
                        _elt = _elt + elt_inner;
                    } else {
                        eltime = eltime + 100;
                    }
                });
        });

        var wow = new WOW({
            boxClass: "wow", // animated element css class (default is wow)
            animateClass: "animated", // animation css class (default is animated)
            offset: 0, // distance to the element when triggering the animation (default is 0)
            mobile: true, // trigger animations on mobile devices (default is true)
            live: true, // act on asynchronously loaded content (default is true)
            callback: function (box) {
                // the callback is fired every time an animation is started
                // the argument that is passed in is the DOM node being animated
            },
            scrollContainer: null, // optional scroll container selector, otherwise use window,
            resetAnimation: true, // reset animation on end (default is true)
        });
        wow.init();
    }

    var theme = {
        init: function () {
            theme.hideWidgetMenuEmpty();
            theme.customProductSearchBtn();
            theme.cms_nav_carousel();
            theme.team_toggle_review();
            theme.videoPlay();
        },
        hideWidgetMenuEmpty: function () {
            /*----------widget_nav_menu-------------*/
            $(document).ready(function () {
                var $nav_menu = $(".widget_nav_menu");
                $nav_menu.find("li.menu-item > a").each(function () {
                    if ($(this).is(":empty")) {
                        $(this).remove();
                    }
                });
            });
        },
        customProductSearchBtn: function () {
            var selector = $("form.woocommerce-product-search").find(
                'button[type="submit"]'
            );
            if (selector.length) {
                selector.each(function (e) {
                    $(this).html('<i class="far fa-search"></i>');
                });
            }
        },
        cms_nav_carousel: function () {
            $(".cms-navigation-carousel").each(function () {
                var selector = $(this);
                var prev_btn = selector.find(".nav-prev");
                var next_btn = selector.find(".nav-next");
                var carousel_ids = selector.data("id");
                if (carousel_ids != "") {
                    var array_ids = carousel_ids.split(",").map(function (item) {
                        return item.trim();
                    });
                    array_ids.forEach(function (item, index) {
                        var c_id = "#" + item;
                        prev_btn.on("click", function () {
                            $(c_id).find(".cms-slick-carousel").slick("slickPrev");
                        });
                        next_btn.on("click", function () {
                            $(c_id).find(".cms-slick-carousel").slick("slickNext");
                        });
                    });
                }
            });
        },
        team_toggle_review: function () {
            $(document).on("click", ".team-info-wrap .review-title", function () {
                $(this).parent().find(".comment-respond").slideToggle(300);
            });
        },
        videoPlay: function () {
            $(document).ready(function () {
                $("a.video-play-button").magnificPopup({
                    type: "iframe",
                    mainClass: "mfp-fade",
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                });
            });
        },
    };
    theme.init();
})(jQuery);
