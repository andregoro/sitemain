
let ytPlaylistParser = (function(){

    function Parser() {

        _.bindAll(this, 'getYtListPage', 'parseYtListPage', 'parseYtListPagination');
    }

    Parser.prototype = {
        parse: function (yt_url) {
            return this.parseYtUrl(yt_url)
                .then(this.getYtListPage)
                .then(this.parseYtListPage);

        },
        parseYtUrl: function(yt_url) {
            return new Promise(function(resolve, reject) {
                const reg = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*list=([^#&?]*).*/;
                let m = yt_url.match(reg);
                if (!m || m.length < 9) {
                    const reg2 = /^.*www.youtube.com\/playlist\?.*list=([^#&?]*).*/;
                    let m2 = yt_url.match(reg2);

                    if (!m2 || m2.length < 2) {
                        reject('Video id not match');
                    } else {
                        resolve(encodeURIComponent(m2[1]));
                    }
                } else {
                    resolve(encodeURIComponent(m[8]));
                }
            });
        },

        getYtListPage: function(listId) {
            const ytListUrl = 'https://www.youtube.com/playlist?list=' + encodeURIComponent(listId);
            return this.getUrlContent(ytListUrl);
        },

        parseYtListPage: function(content) {

            let page_content_div = document.createElement('div');
            page_content_div.innerHTML = content.body;

            let videos = [];

            let trs = page_content_div.getElementsByTagName('tr');

            for (let i = 0; i < trs.length; i++) {
                const tr = trs[i];
                const t_link = tr.getElementsByClassName('pl-video-title-link')[0];
                const t_img = tr.getElementsByTagName('img')[0];

                let title = t_link.innerHTML.trim();
                let video_url = 'https://www.youtube.com' + t_link.getAttribute('href');
                let video_id = tr.getAttribute('data-video-id');
                let img_url = t_img.getAttribute('data-thumb');

                const durations = tr.getElementsByClassName('timestamp');
                let duration = '';
                if (durations && durations.length) {
                    duration = tr.getElementsByClassName('timestamp')[0].innerText.trim();
                }

                videos.push({
                    title: title,
                    video_url: video_url,
                    video_id: video_id,
                    checked: false,
                    img_url: img_url,
                    duration: duration,
                    views: '',
                    upload_time: ''
                });
            }

            let url_more = '';
            const btns = page_content_div.getElementsByClassName('load-more-button');
            if (btns && btns.length) {

                let load_more_args = btns[0].getAttribute('data-uix-load-more-href');
                let args = this.parseQueryString(load_more_args);
                if (args.hasOwnProperty('continuation')) {
                    url_more = 'https://www.youtube.com/browse_ajax?ctoken=' + encodeURIComponent(args.continuation) +
                        '&continuation=' + encodeURIComponent(args.continuation);
                }
            }

            let playlist_name = '';
            const pl_header_title = page_content_div.getElementsByClassName('pl-header-title');
            if (pl_header_title && pl_header_title.length) {
                playlist_name = pl_header_title[0].innerText.trim();
            }

            let icon_src = '';
            const pl_header_thumb = page_content_div.getElementsByClassName('pl-header-thumb');
            if (pl_header_thumb && pl_header_thumb.length) {
                const pl_header_img_thumb = pl_header_thumb[0].getElementsByTagName('img');
                if (pl_header_img_thumb && pl_header_img_thumb.length) {
                    icon_src = pl_header_img_thumb[0].src;
                }
            }

            let channel_info = {
                icon_url: icon_src,
                name: playlist_name
            };

            return {channel_info: channel_info, videos: videos, url_more: url_more, cookies: content.cookies};
        },


        pagination: function (pagination_url, cookies) {
            return this.getUrlContent(pagination_url, cookies)
                .then(this.parseYtListPagination);

        },

        parseYtListPagination: function(res) {
            const parsed = JSON.parse(res.body);
            res.body = '<table>' + parsed.content_html + '</table>' + parsed.load_more_widget_html;

            return this.parseYtListPage(res);
        },

        parseQueryString: function(query_string) {
            return ytParser.parseQueryString(query_string);
        },

        getUrlContent: function (url, cookies) {
            return ytParser.getUrlContent(url, cookies);
        },
    };

    return new Parser;
}());