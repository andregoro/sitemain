//This file should be accessible using URL defined in file  youtube-channel.js,
//in youtubeChannelParser.youtube_channel_helper_url property.

var youtubeChannelHelper = {
    response_is_json: false,
    
    isJsonString: function(str) {
        if (str.charAt(0) === '{') {
            return true;
        } else {
            return false;
        }
    },
             
    parseVideos: function(response_content) {
        let result;
        if (this.isJsonString(response_content)) { // if it is json in Youtube response
            this.response_is_json = true;
            
            const res_json = JSON.parse(response_content);
            
            if (typeof res_json === 'undefined' || !res_json.hasOwnProperty('content_html')) {                
                return {};
            }    
            
            if (!res_json.hasOwnProperty('load_more_widget_html')) {
                res_json.load_more_widget_html = '';
            } 
            
            result = this.getVideosInfoFromHtml(res_json.content_html + res_json.load_more_widget_html);
        } else { // if it is html in Youtube response
            this.response_is_json = false;
            result = this.getVideosInfoFromHtml(response_content);
        }
        
        return result;
    },
    
    extractVideosInfo: function (response_content, cookies_new, getVideosInfoFinishCallback) {

        const result = this.parseVideos(response_content);   //   result = {videos: videos, url_more: url_more}
        
        if (!result.hasOwnProperty('videos') || result.videos.length === 0) { // if no more videos
            this.prepareVideosResult();
            getVideosInfoFinishCallback(this.videosObj, cookies_new, result.url_more);
            
            return;
        }   
        
        //this.all_videos = this.all_videos.concat(result.videos);  
        this.all_videos = result.videos;  
        
        this.prepareVideosResult();
        getVideosInfoFinishCallback(this.videosObj, cookies_new, result.url_more);
    },
    
    addVideos: function (response_content, getVideosInfoFinishCallback) {
        const result = this.parseVideos(response_content);

        if (!result.hasOwnProperty('videos') || result.videos.length === 0) { // if no more videos
            this.prepareVideosResult();
            getVideosInfoFinishCallback(this.videosObj);
            return;
        }   
        
        this.all_videos = this.all_videos.concat(result.videos);        
        
        if (this.all_videos.length >= this.videos_max) {  // if enough videos
            this.all_videos = this.all_videos.slice(0, this.videos_max);
            
            this.prepareVideosResult();
            getVideosInfoFinishCallback(this.videosObj);
            return;
        }   
        
        if (!result.hasOwnProperty('url_more') || result.url_more.length === 0) { // No url to download more
            this.prepareVideosResult();
            getVideosInfoFinishCallback(this.videosObj);
            return;
        }     
        
        setTimeout(this.downloadPage, this.delay, result.url_more, this.addVideos.bind(this), getVideosInfoFinishCallback);
    },
    
    getChannelName: function(el) {
        this.channel_name = el.getElementsByTagName('title')[0].innerText.trim().replace(/\n|\r/g, "");             
    },
    
    getYoutubeVideoId: function (url) {
        let urlObj = new URL(url);
        return urlObj.searchParams.get("v");        
    },
    
    getVideosInfoFromHtml: function(html) {
        // getting info about videos - BEGIN --------
        let videos = [];
        let newHTMLDocument = document.implementation.createHTMLDocument("");
        let div = newHTMLDocument.createElement('div');
        div.innerHTML = html;    
        
        //get channel name
        if (!this.response_is_json) {        
            this.getChannelName(div);      
        }
        
        //get channel icon URL     
        if (!this.response_is_json) {   
            let icon_img_tag = document.evaluate("//*[@id=\"appbar-nav\"]/a/img",
                div, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0);    
            this.channel_icon_url = icon_img_tag.getAttribute('src');
        }
       
        let nodesSnapshot = document.evaluate("//li[@class='channels-content-item yt-shelf-grid-item']",
            div, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
            
        for ( let i=0 ; i < nodesSnapshot.snapshotLength; i++ )
        {
            //exclude video if it is Live Broadcast
            let span_live_broadcast = nodesSnapshot.snapshotItem(i).getElementsByClassName('yt-badge  yt-badge-live');
            if (span_live_broadcast.length > 0) {
                continue;
            }
            
            let $a_tags = nodesSnapshot.snapshotItem(i).getElementsByTagName('a');
            let title = $a_tags[1].textContent;
            let video_url = 'https://www.youtube.com' + $a_tags[1].getAttribute('href');
            let video_id = this.getYoutubeVideoId(video_url);
            let img_url = nodesSnapshot.snapshotItem(i).getElementsByTagName('img')[0].getAttribute('src');
            let span_value = nodesSnapshot.snapshotItem(i).getElementsByTagName('span')[0].textContent;
            let parts = span_value.trim().split(' ');
            let duration = parts[0].trim();
            let ul_s = nodesSnapshot.snapshotItem(i).getElementsByTagName('ul');
            let views;
            let upload_time;

            for ( let j=0 ; j < ul_s.length; j++ ) {
                let class0 = ul_s[j].getAttribute('class');
                if (class0 === 'yt-lockup-meta-info') {
                    let li_s = ul_s[j].getElementsByTagName('li');
                    views = li_s[0].textContent;
                    upload_time = li_s[1].textContent;
                    break;
                }
            }

            videos.push({
                title: title,
                video_url: video_url,
                video_id: video_id,
                checked: false,
                img_url: img_url,
                duration: duration,
                views: views,
                upload_time: upload_time                
            });
        }
        // getting info about videos - END --------
        
        //get url_more
        let url_more = '';
        const button_more = document.evaluate("//button[@data-uix-load-more-href]",
            div, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null ).snapshotItem(0); 
            
        if (button_more === null) {            
            return {videos: videos, url_more: url_more};            
        }

        const url_more_relative = button_more.getAttribute('data-uix-load-more-href');

        if (url_more_relative.length > 0) {
            url_more = 'https://www.youtube.com' + url_more_relative;
        }

        return {videos: videos, url_more: url_more};
    },  
    
    prepareVideosResult: function() {
        this.videosObj = {
            channel_info: {
                name: this.channel_name, 
                icon_url: this.channel_icon_url
            },
            videos: this.all_videos
        };
        
        //clean temp vars
        this.channel_name = '';
        this.channel_icon_url = '';
    }        
};