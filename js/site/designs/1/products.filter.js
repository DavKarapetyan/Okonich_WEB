$(document).ready(function () {
    if ($('.filter').length) {


        // Фильтр
        // $('body').on('click', 'aside .mob_filter_link', function (e) {
        //     e.preventDefault()
        //
        //     if ($(this).hasClass('active')) {
        //         $(this).removeClass('active')
        //         $('aside .filter').fadeOut(200)
        //         $('.overlay').fadeOut(200)
        //     } else {
        //         $(this).addClass('active')
        //         $('aside .filter').fadeIn(300)
        //         $('.overlay').fadeIn(300)
        //     }
        // })
        $('body').on('click', 'aside .mob_filter_link', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('aside .filter').removeClass("active");
                $('.overlay').fadeOut(200)
            } else {
                $(this).addClass('active');
                $('aside .filter').addClass("active");
                $('.overlay').fadeIn(300)
            }
        });

        $('aside .filter .close, .overlay, aside .block .title .close').click(function (e) {
            e.preventDefault()
            $('aside .mob_filter_link').removeClass('active')
            $('aside .filter').removeClass("active");
            // $('aside .filter').fadeOut(200)
            $('.overlay').fadeOut(200)
        })

        var catalogPageSlug = $('#acceptFilter').data().catalog_slug;

        // sorting
        var sortingElem = $('.sorting_switcher');
        var sortParams;

        function setSortParamsFromElements(elem) {
            sortParams = 'sortBy=' + $(elem).data('sort-by') + '&sortType=' + ($(elem).hasClass('sort_asc') ? 'asc' : 'desc')
        }

        sortingElem.on('click', 'li', function () {
            if ($(this).hasClass('active')) {
                if ($(this).hasClass('sort_asc')) {
                    $(this).removeClass('sort_asc');
                    $(this).addClass('sort_desc');
                } else {
                    $(this).removeClass('sort_desc');
                    $(this).addClass('sort_asc');
                }
            } else {
                $(sortingElem).children().each(function (ind, elem) {
                    $(elem).removeClass('active');
                    $(elem).removeClass('sort_desc');
                    $(elem).removeClass('sort_asc');
                    $(elem).addClass('sort_asc');
                });
                $(this).addClass('active');
            }
            setSortParamsFromElements($(this));
            if (window.location.href.includes('?')) {
                if (checkSort() && (!window.location.href.includes('search'))) {
                    acceptFilter(sortParams);
                } else if (checkSort() && window.location.href.includes('search')) {
                    let searchString = checkParams('search');
                    resetFilters();
                    window.location.href = window.location.origin + '/page/' + catalogPageSlug + '?search=' + searchString + '&' + sortParams;
                } else {
                    window.location.href += '&' + sortParams
                }
            } else {
                window.location.href = window.location.origin + '/page/' + catalogPageSlug + '?' + sortParams;
            }
        });

        function checkSort() {
            return (window.location.href.includes('sortType') || window.location.href.includes('sortBy'))
        }

        var productCategoryFilter = $('#productCategoryFilter');
        var searchProduct = $('#searchProduct');

        searchProduct.on('click', function () {
            let searchString = $(this).prev().val();
            resetFilters();
            window.location.href = window.location.origin + '/page/' + catalogPageSlug + '?search=' + searchString;
        });

        // productCategoryFilter.on('click', 'input', function () {
        //     if ($(this).val() == 0) {
        //         productCategoryFilter.find('input').not($(this)).each(function (ind, val) {
        //             $(val).prop("checked", false)
        //         })
        //     } else {
        //         productCategoryFilter.find('input').first().prop("checked", false)
        //     }
        // });

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };
        searchProduct.prev().val(checkParams('search'));
        productCategoryFilter.find('input').each(function (ind, val) {
            let filteredCategories = checkParams('categories');
            $(val).prop("checked", false)
            if ($.inArray($(val).val(), filteredCategories.split(',')) >= 0) {
                $(val).prop("checked", true)
                if ($(val).closest('.tab_filter_title').next('div.data.data_new').length) {
                    $(val).closest('.tab_filter_title').addClass('active')
                    $(val).closest('.tab_filter_title').next('div.data.data_new').show()
                }
                if (!$(val).parent().attr('class')) {
                    $(val)
                        .closest('.tab_filter')
                        .find('.tab_filter_title')
                        .addClass('active')
                        .next('div.data.data_new')
                        .show()
                }
            }
        });

        function checkParams(param) {
            let p = getUrlParameter(param);
            if (p == '' || p == undefined) {
                return param == 'search' ? '' : '0'
            } else {
                return p;
            }
        }

        var maxProductPrice = $('#maxPrice').text();
        var minStartInput = checkParams('from') === '0' ? 0 : checkParams('from');
        var maxStartInput = checkParams('to') === '0' ? maxProductPrice : checkParams('to');

        function removeSortingClasses() {
            sortingElem.find('li').each(function(key,val){
                $(val).removeClass('active');
            })
        }

        switch (checkParams('sortBy')) {
            case 'price':
                removeSortingClasses()
                sortingElem.find('li[data-sort-by="price"]').addClass('active');
                break;
            case 'name':
                removeSortingClasses()
                sortingElem.find('li[data-sort-by="name"]').addClass('active');
                break;
            case 'sale':
                removeSortingClasses()
                sortingElem.find('li[data-sort-by="sale"]').addClass('active');
                break;
            case 'added':
                removeSortingClasses()
                sortingElem.find('li[data-sort-by="added"]').addClass('active');
                break;
            default:
                // sortingElem.find('li[data-sort-by="added"]').addClass('active');
                break;
        }

        switch (checkParams('sortType')) {
            case 'asc':
                sortingElem.find('li.active').attr('class', 'active sort_asc');
                break;
            case 'desc':
                sortingElem.find('li.active').attr('class', 'active sort_desc');
                break;
            default:
                // sortingElem.find('li.active').attr('class', 'active sort_desc');
                break;
        }

        var from;
        var to;
        var categories = [];

        /* ionRangeSlider */

        initIonRangeSlider(maxProductPrice, minStartInput, maxStartInput);

        function initIonRangeSlider(max, from, to) {
            if (to === -Infinity) {
                to = max
            }
            if (from === Infinity) {
                from = 0
            }
            $priceRange = $('.filter #price_range').ionRangeSlider({
                type: 'double',
                min: 0,
                max: max,
                from: from,
                to: to,
                step: 10,
                postfix: ' ₽'
            }).data("ionRangeSlider");
        }

        $('#acceptFilter').on('click', function () {
            setSortParamsFromUrl();
            acceptFilter(sortParams);
        });

        function acceptFilter(sortParams) {
            resetFilters();
            from = $('.filter #price_range').data("ionRangeSlider").old_from;
            to = $('.filter #price_range').data("ionRangeSlider").old_to;
            if (to === 0){
                to = maxProductPrice
            }
            $('.checkboxFilter:checkbox:checked').each(function (ind, val) {
                categories.push($(val).val())
            });
            window.location.href = window.location.origin + '/page/' + catalogPageSlug + '?categories=' + categories + '&from=' + from + '&to=' + to + (sortParams ? ('&' + sortParams) : '');
        }

        function resetFilters() {
            window.location.href = window.location.href.split('?').shift()
        }

        $('.reset-filter').on('click', () => {
            resetFilters();
        })

        function setSortParamsFromUrl() {
            if (getUrlParameter('sortBy') == undefined || getUrlParameter('sortType') == undefined) {
                let sortBy = sortingElem.find('li.active').data('sort-by') || 'added';
                // let sortBy = 'added';
                // if (sortingElem.find('li.active').data('sort-by')){
                //     sortBy = sortingElem.find('li.active').data('sort-by');
                // }
                let sortType = sortingElem.find('li.active').hasClass('sort_asc') ? 'asc' : 'desc';
                sortParams = 'sortBy='+ sortBy +'&sortType=' + sortType;
            } else {
                sortParams = 'sortBy=' + getUrlParameter('sortBy') + '&sortType=' + getUrlParameter('sortType')
            }
        }
    }

});
