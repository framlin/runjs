function Section() {

};

$(function(){
    var checkScroll = true;
    var $secNavigation = $('#sec-navigation');
    var $sectionNavigation = $('<nav id="section-navigation"><ul></ul></nav>');
    var $navigationList = $('ul', $sectionNavigation);
    var $lastMasterSection;

    function getSectionId($section) {
        return $('> header > h1', $section).attr('id');
    }

    function getSectionNavEntry($section){
        return $('#li-'+ getSectionId($section))
    }


    function appendSectionNavigationEntry($navList) {
        return function addEntry() {
            var sectTitle = $('> header > h1', this).text();
            var secID = getSectionId(this);
            var $li = $('<li>' + sectTitle + '</li>');
            $li.attr('id', 'li-'+ secID);
            $navList.append($li);
        }
    }

    function fillSectionNavigation($navList) {
        $('section').each(appendSectionNavigationEntry($navList));
    }


    function scrollWatcher(event) {
        if (checkScroll){
            setTimeout(augmentVisibleSections(), 100);
        }
    }


    function isVisible(viewportHeight, top, height) {
        var viewportTop = 0,
            topIntersects = (top > viewportTop) && (top < (viewportTop + viewportHeight)),
            bottomIntersects = ((top +height) > viewportTop) && ((top +height)  < (viewportTop + viewportHeight));

        return topIntersects || bottomIntersects;
    }

    function augmentSectionNavigation() {
        var offset = $(this).offset(),
            posY = offset.top - $(window).scrollTop(),
            height = $(this).height();


        if (isVisible($(window).height(), posY, height)) {
            $(this).trigger('startVisibleSection');
        } else {
            $(this).trigger('finishVisibleSection');
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
        var mostVisible = {area: 0, section: null, top:$(window).height() +100},
            masterSecID = null,
            lastMasterSecID = getSectionId($lastMasterSection);

        function computeMostVisible() {
            var offset = $(this).offset(),
                posY = offset.top - $(window).scrollTop(),
                height = $(this).height(),
                visibleHeight = getVisibleHeight($(this)),
                area = (visibleHeight/height)*100;


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
        }

        $sections.each(computeMostVisible);

        masterSecID = getSectionId(mostVisible.section);
        if (lastMasterSecID != masterSecID) {
            if ($lastMasterSection) {
                $lastMasterSection.trigger('finishMasterSection');
            }
            $lastMasterSection = mostVisible.section;
            $lastMasterSection.trigger('startMasterSection');
        }

    }

    function augmentVisibleSections() {
        var $sections = $('section');

        checkScroll = false;
        return function logger() {
            $sections.each(augmentSectionNavigation);
            augmentMasterSection($sections);
            checkScroll = true;
        }
    }

    function onStartMasterSection(event) {
        var $sectionNavigationEntry = getSectionNavEntry($(this)),
            $sectionHeading = $('> header', $(this)).clone(),
            $sectionContext = $('#section-context');

        $sectionNavigationEntry.addClass('master-section');


        $sectionHeading.appendTo($sectionContext);
        $('.section-context', $(this)).clone().appendTo($sectionContext);
        $(this).addClass('master-section');
    }

    function onFinishMasterSection(event) {
        var $sectionNavigationEntry = getSectionNavEntry($(this)),
            $sectionContext = $('#section-context'),
            $sectionContextHeading = $('> header', $sectionContext);

        if ($sectionNavigationEntry.hasClass('master-section')) {
            $sectionNavigationEntry.removeClass('master-section');
        }
        $sectionNavigationEntry.addClass('visible-section');
        $sectionContextHeading.remove();


        $('.section-context', $sectionContext).remove();
        if ($(this).hasClass('master-section')) {
            $(this).removeClass('master-section');
        }
    }

    function onStartVisibleSection(event) {
        var $sectionNavigationEntry;

        if (!$(this).hasClass('master-section')) {
            $sectionNavigationEntry = getSectionNavEntry($(this));
            $sectionNavigationEntry.addClass('visible-section');
        }
    }

    function onFinishVisibleSection(event) {
        var $sectionNavigationEntry = getSectionNavEntry($(this));

        if ($sectionNavigationEntry.hasClass('visible-section')) {
            $sectionNavigationEntry.removeClass('visible-section');
        }

    }

    function initSections($sections) {
        $sections.each(function () {
            $(this).on('startVisibleSection', onStartVisibleSection);
            $(this).on('finishVisibleSection', onFinishVisibleSection);
            $(this).on('startMasterSection', onStartMasterSection);
            $(this).on('finishMasterSection', onFinishMasterSection);
        });
    }


    $secNavigation.width(200);
    $secNavigation.append($sectionNavigation);

    initSections($('section'));
    fillSectionNavigation($navigationList);

    $(window).scroll(scrollWatcher);

    augmentVisibleSections()();

    $($secNavigation).width($(window).width() - 20);

    $('#section-context').top(+($($secNavigation).top())+20);
});

