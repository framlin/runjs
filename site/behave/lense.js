function Sections($, $sections) {
    var me = this;

    this.getMasterSection = function getMasterSection() {
        return $('.master-section', $('article'));
    };

    this.getSectionId = function getSectionId($section) {
        return $('> header > h1', $section).attr('id');
    };

    this.getSectionNavEntry = function getSectionNavEntry($section){
        return $('#li-'+ this.getSectionId($section))
    };

    this.isVisible = function isVisible(viewportHeight, top, height) {
        var viewportTop = 0,
            topIntersects = (top > viewportTop) && (top < (viewportTop + viewportHeight)),
            bottomIntersects = ((top +height) > viewportTop) && ((top +height)  < (viewportTop + viewportHeight));

        return topIntersects || bottomIntersects;
    };

    this.getVisibleHeight = function getVisibleHeight($section) {
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

    };

    this.onStartMasterSection = function onStartMasterSection(event) {
        var $sectionNavigationEntry = me.getSectionNavEntry($(this)),
            $sectionHeading = $('> header', $(this)).clone(),
            $sectionContext = $('#section-context');

        $sectionNavigationEntry.addClass('master-section');


        $sectionHeading.appendTo($sectionContext);
        $('.section-context', $(this)).clone().appendTo($sectionContext);
        $(this).addClass('master-section');
    };

    this.onFinishMasterSection = function onFinishMasterSection(event) {
        var $sectionNavigationEntry = me.getSectionNavEntry($(this)),
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
    };

    this.onStartVisibleSection = function onStartVisibleSection(event) {
        var $sectionNavigationEntry;

        if (!$(this).hasClass('master-section')) {
            $sectionNavigationEntry = me.getSectionNavEntry($(this));
            $sectionNavigationEntry.addClass('visible-section');
        }
    };

    this.onFinishVisibleSection = function onFinishVisibleSection(event) {
        var $sectionNavigationEntry = me.getSectionNavEntry($(this));

        if ($sectionNavigationEntry.hasClass('visible-section')) {
            $sectionNavigationEntry.removeClass('visible-section');
        }

    };

    this.onClick = function onClick(event) {
        var $currMaster = me.getMasterSection();

        if(me.getSectionId($(this)) != me.getSectionId($currMaster)) {
            $currMaster.trigger('finishMasterSection');
            $(this).trigger('startMasterSection');
            me.scrollTo($(this))();
        }

    };

    this.initSections = function initSections($sections) {
        $sections.each(function () {
            $('.section-context', $(this)).addClass('extended');
            $(this).on('startVisibleSection', me.onStartVisibleSection);
            $(this).on('finishVisibleSection', me.onFinishVisibleSection);
            $(this).on('startMasterSection', me.onStartMasterSection);
            $(this).on('finishMasterSection', me.onFinishMasterSection);
            $(this).on('click', me.onClick);
        });
    };

    this.navigationClicked = function navigationClicked($section) {
        return function navigator(event) {
            $section.click();
        }
    };

    this.appendSectionNavigationEntry = function appendSectionNavigationEntry($navList) {
        return function addEntry() {
            var sectTitle = $('> header > h1', this).text(),
                secID = me.getSectionId(this),
                $li = $('<li>' + sectTitle + '</li>');

            $li.attr('id', 'li-'+ secID);
            $li.click(me.navigationClicked(this));

            $navList.append($li);
        }
    };

    this.fillSectionNavigation = function fillSectionNavigation($navList) {
        $('section').each(me.appendSectionNavigationEntry($navList));
    };

    this.scrollTo = function scrollTo($section) {
        return function scroller() {
            $('html, body').animate({
                scrollTop: $($section).offset().top - 100
            }, 200);
        };
    };

    this.initSections($sections);

}

$(function() {
    var checkScroll = true,
        $secNavigation = $('#sec-navigation'),
        $sectionNavigation = $('<nav id="section-navigation"><ul></ul></nav>'),
        $navigationList = $('ul', $sectionNavigation),
        sections = new Sections($, $('section'));



    function scrollWatcher(event) {
        if (checkScroll){
            setTimeout(augmentVisibleSections(), 100);
        }
    }



    function augmentSectionNavigation() {
        var offset = $(this).offset(),
            posY = offset.top - $(window).scrollTop(),
            height = $(this).height();


        if (sections.isVisible($(window).height(), posY, height)) {
            $(this).trigger('startVisibleSection');
        } else {
            $(this).trigger('finishVisibleSection');
        }
    }


    function augmentMasterSection($sections) {
        var mostVisible = {area: 0, section: null, top:$(window).height() +100},
            masterSecID = null,
            lastMasterSecID = sections.getSectionId(sections.getMasterSection());

        function computeMostVisible() {
            var offset = $(this).offset(),
                posY = offset.top - $(window).scrollTop(),
                height = $(this).height(),
                visibleHeight = sections.getVisibleHeight($(this)),
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

        masterSecID = sections.getSectionId(mostVisible.section);
        if (lastMasterSecID != masterSecID) {
            if (sections.getMasterSection()) {
                sections.getMasterSection().trigger('finishMasterSection');
            }
            mostVisible.section.trigger('startMasterSection');
        }

    }

    function augmentVisibleSections() {
        var $sections = $('section');

        onResize(null);
        checkScroll = false;
        return function logger() {
            $sections.each(augmentSectionNavigation);
            augmentMasterSection($sections);
            checkScroll = true;
        }
    }

    function onResize(event) {
        console.log($(window).width());
        $($secNavigation).width($(window).width() - 20);

        if ($(window).width() < 1333) {
            if ($('#section-context').hasClass('extended')) {
                $('#section-context').removeClass('extended');
            };
            $('section').each(function() {
                if ( $('.section-context', $(this)).hasClass('extended')) {
                    $('.section-context', $(this)).removeClass('extended');
                }
            });
        } else {
            $('#section-context').addClass('extended');
            $('section').each(function() {
                $('.section-context', $(this)).addClass('extended');
            });

        }
    }


    //--------------------------------------------------------------
    $secNavigation.width(200);
    $secNavigation.append($sectionNavigation);
    $($secNavigation).width($(window).width() - 20);

    sections.fillSectionNavigation($navigationList);

    $(window).scroll(scrollWatcher);
    $(window).resize(onResize);

    augmentVisibleSections()();

    $('#section-context').top(+($($secNavigation).top())+20);
});

