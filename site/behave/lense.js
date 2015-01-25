$(function(){
    var checkScroll = true;
    var $secNavigation = $('#secNavigation');
    var sectionNavigation = $('<nav id="sectionNavigation"><ul></ul></nav>');
    var navList = $('ul', sectionNavigation);
    var $lastMasterSection;

    function fillSectionNavigation($navList) {
        $('section').each(function() {
            var sectTitle = $('> header > h1', this).text();
            var secID = $('> header > h1', this).attr('id');
            var $li = $('<li>' + sectTitle + '</li>');
            $li.attr('id', 'li-'+ secID);
            $navList.append($li);
        });
    };


    function scrollWatcher(event) {
        if (checkScroll){
            setTimeout(augmentVisibleSections(), 100);
        }
    }


    function isVisible(top, height) {
        var navTop = 0;
        var navHeight = $(window).height();
        var topIntersects = (top > navTop) && (top < (navTop + navHeight));
        var bottomIntersects = ((top +height) > navTop) && ((top +height)  < (navTop + navHeight))

        return topIntersects || bottomIntersects;
    }

    function augmentSectionNavigation() {
        var offset = $(this).offset();
        var posY = offset.top - $(window).scrollTop();
        var height = $(this).height();
        var $currSection = $('#li-'+$('> header > h1', this).attr('id'));

        if (isVisible(posY, height)) {
            $currSection.css({'color': 'blue'});
        } else {
            $currSection.css({'color': 'black'});
        }
    }

    function getVisibleHeight($section) {
        var offset = $section.offset();
        var posY = offset.top - $(window).scrollTop();
        var height = $section.height();

        var result;

        if (posY < 0) {
            if ((height + posY) > $(window).height()){
                result = $(window).height();
            } else {
                result = height + posY;
            }
        } else {
            if ((height + posY) > $(window).height()){
                result = $(window).height() - posY;
            } else {
                result = height;
            }

        }

        return result;

    }

    function augmentMasterSection($sections) {
        var mostVisible = {area: 0, section: null, top:$(window).height() +100};
        var masterSecID = null;
        var lastMasterSecID = $('> header > h1', $lastMasterSection).attr('id');

        $sections.each(function() {
            var offset = $(this).offset();
            var posY = offset.top - $(window).scrollTop();
            var height = $(this).height();

            var visibleHeight = getVisibleHeight($(this));

            var area = (visibleHeight/height)*100;

            if (area > mostVisible.area) {
                mostVisible.section = $(this);
                mostVisible.area = area;
                mostVisible.top = posY;
            } else if (area == mostVisible.area) {
                if (posY < mostVisible.top) {
                    mostVisible.section = $(this);
                    mostVisible.area = area;
                    mostVisible.top = posY;
                }
            }
        });

        masterSecID = $('> header > h1', mostVisible.section).attr('id');
        if (lastMasterSecID != masterSecID) {
            if ($lastMasterSection) {
                $('.sources', $('#sectionContext')).appendTo($lastMasterSection);
                if ($lastMasterSection.hasClass('masterSection')) {
                    $lastMasterSection.removeClass('masterSection');
                }
            }
            $lastMasterSection = mostVisible.section;
            $('.sources', $lastMasterSection).appendTo($('#sectionContext'))
            $lastMasterSection.addClass('masterSection');
        }

    }

    function augmentVisibleSections() {
        checkScroll = false;
        var $sections = $('section');
        return function logger() {
            $sections.each(augmentSectionNavigation);
            augmentMasterSection($sections);
            checkScroll = true;
        }
    }



    $secNavigation.width(200);
    $secNavigation.append(sectionNavigation);

    fillSectionNavigation(navList);

    $(window).scroll(scrollWatcher);

    augmentVisibleSections()();

});

