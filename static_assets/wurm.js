var Facederp = (function(jQuery){

    var $ = jQuery, pages_loaded = 0;

    function insert_center_strip() {
        var strip = $('<div/>'),
            strip_stripe = $('<div/>'),
            cross = $('<div/>');

        strip.addClass('the-strip').attr('id','the-strip');
        strip_stripe.addClass('the-strip-stripe');
        cross.addClass('strip-cross');

        strip.append(strip_stripe);
        strip.append(cross);

        $('body').prepend(strip);

        setup_tumblr_iframe();

        strip.on('mouseenter.Facederp', function(){
            cross.show();
        });
        strip.on('mouseleave.Facederp', function(){
            cross.hide();
        });
        strip.on('click.Facederp', function(event){
            var offset = event.clientY-20;
            show_tumblr_iframe(offset);
        });
        $(document).on('mousemove.Facederp', function(event){
            var offset = event.clientY-5;
            cross.css({
                top     : offset + 'px'
            });
        });
    }

    function fetch_post_notes() {
        var notes_button = $(event.target),
            notes_url = notes_button.attr('href'),
            notes_container = $('<div />'),
            notes_parent_post = notes_button.closest('.post');

        notes_container.addClass('notes-container collapsed');

        if (!notes_url) return false;

        notes_button.addClass('loading');

        var nb_ajax = $.get(notes_url, function(data) {
            notes_container.append(data);
            setup_notes_toggle(notes_button);
        })
        .error(function() {
            var notes_error = $('<ol/>');
            notes_error.html('<li class="note error">zomg nobody liked this post</li>');
            notes_error.addClass('notes notes-error');
            notes_container.append(notes_error);
        })
        .complete(function() {
            notes_button.removeClass('loading');
            notes_parent_post.append(notes_container);
            setTimeout(function(){
                notes_parent_post.find('.notes-container').removeClass('collapsed');
                setTimeout(setup_article_nipples, 500);
            },0);

            // Just before you show the loading text, apply this class name
            $('.more_notes_link').unbind('mousedown.Facederp').bind('mousedown.Facederp', function(){
                $('.note.more_notes_link_container span').addClass('loading-animation');
            });
        });

        return false;
    }

    function setup_notes_toggle(btn) {
        btn.off('click.Facederp').on('click.Facederp', function(){
            btn.closest('.post').find('.notes-container').toggleClass('collapsed');
            setTimeout(setup_article_nipples, 500);
            return false;
        });
    }

    function check_compact_sidebar() {
        var sidebar = $('#sidebar-links'),
            link_num = sidebar.children().length + 4,
            link_height = 25,
            win_h = $(window).height();

        sidebar.removeClass('compact');
        if ((link_num * link_height) >= win_h) sidebar.addClass('compact');
    }

    function setup_sidebar_links() {
        var sidebar = $('<ul/>'),
            links = $('.infscr-pages'),
            link_num = links.length;

        check_compact_sidebar(); // Check for compact sidebar before we destroy the old one

        $('#sidebar-links').remove();

        sidebar.append('<li><a href="#to_top" class="sidebar-link js-to-top" id="sidebar-link-1">Page 1</a></li>');

        links.each(function(index){
            var link = $(this);
            index++; index++;
            link.attr('id', 'page-' + index );
            if ( $('#page-' + index).children().length ) {
                sidebar.append('<li><a href="#page-' + index + '" class="sidebar-link js-sidebar-link" id="sidebar-link-' + index + '">Page ' + index + '</a></li>');
            }
        });

        sidebar.addClass('sidebar-links').attr('id','sidebar-links');

        $('.bigwrap-right').append(sidebar);

        $('.js-sidebar-link').off('click.Facederp').on('click.Facederp', function(event){
            var link = $(this),
                page = $(link.attr('href'));
            $.scrollTo(page, 500, { offset: -46 }); // offset for top bar
            event.preventDefault();
        });

        setup_events();
    }

    function setup_tumblr_iframe() {
        var tumblr_controls = $('#tumblr_controls'),
            wrapper = $('<div />');

        wrapper.addClass('tumblr-controls-wrapper');
        wrapper.attr('id', 'tumblr-controls-wrapper');
        tumblr_controls.wrap(wrapper);
        $('#the-strip').append($('#tumblr-controls-wrapper'));
    }

    function show_tumblr_iframe(offset) {
        var controls = $('#tumblr-controls-wrapper');
        controls.css({
            top     : offset + 'px'
        }).addClass('visible');
        $(document).bind('mousedown.Facederp', function(event){
            var $tgt = $(event.target);
            if (!$tgt.closest('#tumblr-controls-wrapper').length) {
                hide_tumblr_iframe();
            }
        });
    }

    function hide_tumblr_iframe() {
        var controls = $('#tumblr-controls-wrapper');
        $(document).unbind('mousedown.Facederp');
        controls.removeClass('visible');
    }

    function show_pages_menu() {
        var pages = $('#pages');
        pages.addClass('open');
        $(document).on('click.Facederp', function(){
            var $tgt = $(event.target);
            if (!$tgt.closest('#pages').length) {
                pages.removeClass('open');
                $(document).off('click.Facederp');
            }
        });
    }

    function setup_ask_submit_menu() {
        var a_s_box = $('#ask-submit-box'),
            menu = a_s_box.find('.ask-submit-menu'),
            btns = menu.find('li');

        // If there are no submissions box or ask box
        // Hide the container
        if (!a_s_box.find('div.sub-box').length) {
            a_s_box.hide();
            return;
        } else {
            if (a_s_box.find('.ask-button').length) {
                a_s_box.addClass('show-ask');
            } else {
                if (a_s_box.find('.submit-button').length) {
                    a_s_box.addClass('show-submission');
                }
            }
        }

        btns.on('click.Facederp',function(){
            var btn = $(this);
            if (btn.hasClass('ask-button')) {
                a_s_box.addClass('show-ask').removeClass('show-submission');
            }
            if (btn.hasClass('submit-button')) {
                a_s_box.removeClass('show-ask').addClass('show-submission');
            }
            return false;
        });
    }

    function show_chat_box() {
        var chat = $('.chat-box');
        chat.removeClass('offline');
        $(document).on('click.Facederp', function(event){
            var $tgt = $(event.target);
            if (!$tgt.closest('.chat-box').length) {
                chat.addClass('offline');
                $(document).off('click.Facederp');
            }
        });
    }

    function show_friends_box() {
        var friend_button = $('.friends-button'),
            box = friend_button.parent();

        if (friend_button.next('.friends-box').length) {
            box.addClass('show_friends');
            $(document).on('click.Facederp', function(event){
                var $tgt = $(event.target);
                if (!$tgt.closest('.friends').length) {
                    box.removeClass('show_friends');
                    $(document).off('click.Facederp');
                }
            });
            return false;
        }
    }

    function setup_photo_viewer() {
        if (!$('#photo-overlay').length) create_photo_overlay();

        $('img[data-hi-res]').off('click.Facederp').on('click.Facederp', show_photo_overlay);
    }

    function create_photo_overlay() {
        var overlay = $('<div/>'),
            overlay_box = $('<div/>');
        overlay.addClass('photo-overlay off').attr('id','photo-overlay');
        overlay_box.addClass('photo-overlay-box');
        overlay.append(overlay_box);
        $('body').append(overlay);
    }

    function show_photo_overlay(event) {

        event.preventDefault();

        var overlay = $('#photo-overlay'),
            photo_container = overlay.find('.photo-overlay-box');
            photo = $(event.target);

        photo_container.css({
            backgroundImage : 'url("' + photo.attr('data-hi-res') + '")'
        });

        overlay.removeClass('off');
        setup_overlay_events();

        return false;
    }

    function hide_photo_overlay() {
        var overlay = $('#photo-overlay');
        overlay.addClass('off');
    }

    function setup_overlay_events() {

        $('#photo-overlay').on('click.Facederp', function(event){
            hide_photo_overlay();
            $('#photo-overlay').off('click.Facederp');
            event.preventDefault();
        });

        $(document).off('keyup.Facederp').on('keyup.Facederp', function(event){
            // ESC
            if (event.keyCode == 27) {
                hide_photo_overlay();
                $(document).off('keyup.Facederp');
            }
        });
    }

    function decorate_audio_player() {
        $('.post .audio iframe').addClass('audio-player');
    }

    function setup_article_nipples() {
        var articles = $('.content article:not(#twitter)'), prev_offset = 0;
        articles.removeClass('nipple-left').removeClass('nipple-right');

        articles.each(function(){
            var article = $(this), article_offset = article.offset().left;
            if (!prev_offset) {
                article.addClass('nipple-right');
            } else if (prev_offset <= article_offset) {
                article.addClass('nipple-left');
            } else {
                article.addClass('nipple-right');
            }
            prev_offset = article_offset;
        });
    }

    function scroll_to_top() {
        $.scrollTo(0, 1000);
        return false;
    }

    function setup_events() {
        // Unset & Set Click events to prevent double binding
        $('a.js-to-top').off('click.scrollTo').on('click.scrollTo', scroll_to_top);
        $('a.notes-button').off('click.Facederp').on('click.Facederp', fetch_post_notes);
        $('#pages:not(.open)').off('click.Facederp').on('click.Facederp', show_pages_menu);
        $('.chat-box.offline').off('click.Facederp').on('click.Facederp', show_chat_box);
        $('.friends-button').off('click.Facederp').on('click.Facederp', show_friends_box);
        $(window).off('resize.Facederp').on('resize.Facederp', check_compact_sidebar);
    }

    function setup_infinite_scroll() {
        // Infinite Scroll plugin
        // copyright: Paul Irish &amp; dirkhaim
        // license: cc-wrapped GPL : http://creativecommons.org/licenses/GPL/2.0/
        $('ul.allposts').infinitescroll({
            debug           : false,
            nextSelector    : 'a.next',
            text            : '',
            donetext        : 'You were born.',
            navSelector     : '.pagination',
            contentSelector : '.content > .container > .content-wrap',
            itemSelector    : '.content > .container > .content-wrap > .post',
            bufferPx        : 200
        }, after_infinite_scroll);
    }

    function after_infinite_scroll() {
        setup_events();
        setup_sidebar_links();
        decorate_audio_player();
        setup_article_nipples();
        setup_photo_viewer();
    }

    return {
        init : function() {
            if (window.INFINITESCROLL) setup_infinite_scroll();
            setup_events();
            setup_ask_submit_menu();
            decorate_audio_player();
            setup_article_nipples();
            setup_photo_viewer();
            $(window).load(insert_center_strip);
        }
    };

}(jQuery));

Facederp.init();