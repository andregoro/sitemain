
var YtStreamType ={
    OrdinaryVideo: 0,
    Video3D: 1,
    AppleLiveStreaming: 2,
    DashMP4Video: 3,
    DashMP4Audio: 4,
    DashWebmVideo: 5,
    DashWebmAudio: 6,
};

let ytParser = (function(){

    const itagsInfo = {
        "5":{"format":"flv","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "400", height: "240"},
        "6":{"format":"flv","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "450", height: "270"},
        "13":{"format":"3gp","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "0", height: "0"},
        "17":{"format":"3gp","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "176", height: "144"},
        "18":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "640", height: "360"},
        "22":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "1280", height: "720"},
        "34":{"format":"flv","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "640", height: "360"},
        "35":{"format":"flv","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "854", height: "480"},
        "36":{"format":"3gp","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "320", height: "240"},
        "37":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "1920", height: "1080"},
        "38":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "4096", height: "3072"},
        "43":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "640", height: "360"},
        "44":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "854", height: "480"},
        "45":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "1280", height: "720"},
        "46":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.OrdinaryVideo, width: "1920", height: "1080"},

        // "82":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "360"},
        // "83":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "480"},
        // "84":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "720"},
        // "85":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "1080"},
        // "100":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "360"},
        // "101":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "480"},
        // "102":{"format":"webm","withVideo":true,"withAudio":true, StreamType: YtStreamType.Video3D, width: "0", height: "720"},

        "92":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "240"},
        "93":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "360"},
        "94":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "480"},
        "95":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "720"},
        "96":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "1080"},
        "132":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "240"},
        "151":{"format":"mp4","withVideo":true,"withAudio":true, StreamType: YtStreamType.AppleLiveStreaming, width: "0", height: "720"},

        "133":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "240"},
        "134":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "360"},
        "135":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "480"},
        "136":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "720"},
        "137":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "1080"},
        "138":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "2160"},
        "160":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "144"},
        "264":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "1440"},

        // 60 fps
        "298":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "720"},
        "299":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "1080"},
        "266":{"format":"mp4","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashMP4Video, width: "0", height: "2160"},

        "139":{"format":"m4a","withVideo":false,"withAudio":true, StreamType: YtStreamType.DashMP4Audio, width: "0", height: "0"},
        "140":{"format":"m4a","withVideo":false,"withAudio":true, StreamType: YtStreamType.DashMP4Audio, width: "0", height: "0"},
        "141":{"format":"m4a","withVideo":false,"withAudio":true, StreamType: YtStreamType.DashMP4Audio, width: "0", height: "0"},

        "167":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "640", height: "480"},
        "168":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "854", height: "480"},
        "169":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "1280", height: "720"},
        "170":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "1920", height: "1080"},
        "218":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "854", height: "480"},
        "219":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "854", height: "480"},
        "242":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "240"},
        "243":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "360"},
        "244":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "480"},
        "245":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "480"},
        "246":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "480"},
        "247":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "720"},
        "248":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "1080"},
        "271":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "1440"},
        "272":{"format":"webm","withVideo":true,"withAudio":false, StreamType: YtStreamType.DashWebmVideo, width: "0", height: "2160"},

        // "302":{"format":"webm","withVideo":true,"withAudio":false},
        // "303":{"format":"webm","withVideo":true,"withAudio":false},
        // "308":{"format":"webm","withVideo":true,"withAudio":false},
        // "313":{"format":"webm","withVideo":true,"withAudio":false},
        // "315":{"format":"webm","withVideo":true,"withAudio":false},

        "171":{"format":"webm","withVideo":false,"withAudio":true, StreamType: YtStreamType.DashWebmAudio, width: "0", height: "0"},
        "172":{"format":"webm","withVideo":false,"withAudio":true, StreamType: YtStreamType.DashWebmAudio, width: "0", height: "0"}};

    function Parser() {

        _.bindAll(this, 'parseYtConfig', 'getYtConfig', 'checkSignature');
    }


    Parser.prototype = {
        parse: function (yt_url) {
            return this.parseYtUrl(yt_url)
                .then(this.getYtConfig)
                .then(this.checkSignature)
                .then(this.parseYtConfig);

        },
        parseYtUrl: function(yt_url) {
            return new Promise(function(resolve, reject) {
                const reg = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                let m = yt_url.match(reg);
                if (!m || m.length < 8) {
                    reject('Video id not match');
                } else {
                    resolve(encodeURIComponent(m[7]));
                }
            });
        },

        checkSignature: function(ytConfig) {
            if (ytConfig && ytConfig.assets && ytConfig.assets.js) {
                const js_url = 'https://www.youtube.com' + ytConfig.assets.js;
                console.error(js_url);
                return this.getUrlContent(js_url)
                    .then(function(page_content){

                        const reg = /function\(a\)\{a=a\.split\(""\);(.+);return a.join\(""\)\};/;
                        const m = page_content.body.match(reg);

                        if (m && m.length === 2) {

                            const signature_fn = m[1];
                            const reg_obj_name = /^(.+?)\./;
                            const m_obj_name = signature_fn.match(reg_obj_name);

                            if (m_obj_name && m_obj_name.length === 2) {
                                const obj_name = m_obj_name[1];
                                const reg_obj = new RegExp('var (' + obj_name + '=(\\{[\\s\\S]+?\\}\\});)');
                                const m_obj = page_content.body.match(reg_obj);
                                eval(m_obj[1]);
                                eval('global_signature = ' + m[0]);
                            }
                        }
                        return ytConfig;

                    }.bind(this));
            } else {
                return ytConfig;
            }
        },

        parseYtConfig: function(ytConfig) {
            const urlsList = this.parseYtUrlsList(ytConfig);
            let result = {
                urlsList: urlsList,
                cookies: ytConfig.response.cookies,
                title: ytConfig.args.title,
                previews: this.parseYtPreviews(ytConfig)
            };

            result.videoDate = '';
            if (ytConfig.configType === 'page') {
                const date_reg = /"datePublished" content="(\d{4}-\d{2}-\d{2})"/;
                const m = ytConfig.response.body.match(date_reg);
                if (m && m.length > 1) {
                    result.videoDate = m[1];
                }
            }

            return result;
        },

        parsePageYtConfig: function(content) {

            const reg = /ytplayer.config = ({.+});ytplayer/;
            const m = content.match(reg);
            if (!m || m.length < 2) {
                console.error('Content not match');
                throw new Error('Content not match');
            }
            return JSON.parse(m[1]);
        },

        parseYtPreviews: function(ytPageConfig) {
            try {
                const player = JSON.parse(ytPageConfig.args.player_response);
                let result = [];
                if (player.videoDetails.thumbnail.thumbnails) {
                    for (let i = 0; i < player.videoDetails.thumbnail.thumbnails.length; i++) {
                        const preview = player.videoDetails.thumbnail.thumbnails[i];
                        result.push({
                            url: preview.url,
                            height: preview.height.toString(),
                            width: preview.width.toString()
                        });
                    }
                }
                return result;
            } catch (e) {
                return [];
            }
        },

        parseYtUrlsList: function(configData) {

            let i, item;
            let streamAdaptiveList = [];
            if (configData.args.adaptive_fmts) {
                streamAdaptiveList = configData.args.adaptive_fmts.split(',');
            }
            let urls_audio_only = [];

            let adaptive_fmts = [];
            for (i =0; i < streamAdaptiveList.length; i++ ) {
                item = this.parseQueryString(streamAdaptiveList[i]);
                if (item && item.itag && itagsInfo[item.itag]) {
                    item.itagInfo = itagsInfo[item.itag];
                    if (item.itagInfo.StreamType === YtStreamType.DashWebmAudio
                        || item.itagInfo.StreamType === YtStreamType.DashMP4Audio)
                        urls_audio_only.push(item);
                    adaptive_fmts.push(item);
                }
            }

            const urlEncodedFmt = configData.args.url_encoded_fmt_stream_map.split(',');
            let url_encoded_fmt_stream_map = [];
            for (i =0; i < urlEncodedFmt.length; i++ ) {
                item = this.parseQueryString(urlEncodedFmt[i]);
                if (item && item.itag && itagsInfo[item.itag]) {
                    item.itagInfo = itagsInfo[item.itag];
                    if (item.itagInfo.StreamType === YtStreamType.DashWebmAudio
                        || item.itagInfo.StreamType === YtStreamType.DashMP4Audio)
                        urls_audio_only.push(item);
                    url_encoded_fmt_stream_map.push(item);
                }
            }

            let all_links = adaptive_fmts.concat(url_encoded_fmt_stream_map);

            for (i = 0; i < all_links.length; i++) {
                let link = all_links[i];
                let signature = '';
                if (link.sig) {
                    signature = this.getSignature(link.sig);
                } else if (link.s) {
                    signature = this.getSignature(link.s);
                }
                if (signature) {
                    link.url = link.url + '&signature=' + signature;
                }
            }

            for (i = 0; i < all_links.length; i++) {
                item = all_links[i];
                if (item.itagInfo.withVideo && !item.itagInfo.withAudio) {
                    for (let j = 0; j < urls_audio_only.length; j++) {
                        const audio_item = urls_audio_only[j];
                        if (item.itagInfo.StreamType === YtStreamType.DashMP4Video &&
                            audio_item.itagInfo.StreamType === YtStreamType.DashMP4Audio) {
                            item.audioItem = audio_item;
                            break;
                        }
                        if (item.itagInfo.StreamType === YtStreamType.DashWebmVideo &&
                            audio_item.itagInfo.StreamType === YtStreamType.DashWebmAudio) {
                            item.audioItem = audio_item;
                            break;
                        }
                    }
                }
            }
            return this.formatList(all_links);
        },

        formatList: function(all_links) {

            let formatted_list = [];
            for (let i = 0; i < all_links.length; i++) {
                const item = all_links[i];
                let formatted_item = {
                    fileExt: item.itagInfo.format,
                    videoUrl: "",
                    videoWidth: "0",
                    videoHeight: "0",
                    videoTag: "",
                    videoContentSize: "0",
                    audioUrl: "",
                    audioTag: "",
                    audioContentSize: "0"
                };

                if (item.itagInfo.withVideo) {
                    formatted_item.videoUrl = item.url;

                    let videoWidth = "0";
                    let videoHeight = "0";
                    if (item.size) {
                        let sizeM = item.size.split('x');
                        if (sizeM && sizeM.length === 2) {
                            videoWidth = sizeM[0];
                            videoHeight = sizeM[1];
                        }
                    }
                    if (item.itagInfo.width && videoWidth === "0")
                        videoWidth = item.itagInfo.width;
                    if (item.itagInfo.height && videoHeight === "0")
                        videoHeight = item.itagInfo.height;

                    formatted_item.videoWidth = videoWidth;
                    formatted_item.videoHeight = videoHeight;

                    formatted_item.videoTag = item.itag;
                    if (item.clen)
                        formatted_item.videoContentSize = item.clen;
                    if (!item.itagInfo.withAudio && item.audioItem) {
                        formatted_item.audioUrl = item.audioItem.url;
                        formatted_item.audioTag = item.audioItem.itag;
                        if (item.audioItem.clen)
                            formatted_item.audioContentSize = item.audioItem.clen;
                    }
                } else {
                    formatted_item.audioUrl = item.url;
                    formatted_item.audioTag = item.itag;
                    if (item.clen)
                        formatted_item.audioContentSize = item.clen;
                }
                formatted_list.push(formatted_item);
            }

            return formatted_list;
        },

        parseQueryString: function(query_string) {
            let result = {};
            const pairs = query_string.split('&');
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i].split('=');
                if (pair[0] === 'title') {
                    pair[1] = pair[1].split('+').join(' ');
                }
                result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return result;
        },

        getYtConfig: function(yt_id) {
            return this.getPageContent(yt_id)
                .then(function(page_content){
                    const page_config = this.parsePageYtConfig(page_content.body);
                    return {
                        response: {
                            body: page_content.body,
                            cookies: page_content.cookies,
                        },
                        configType: 'page',
                        args: page_config.args,
                        assets: page_config.assets
                    };
                }.bind(this));
            // return this.getApiContent(yt_id)
            //     .then(function(api_content){
            //         const api_config = this.parseQueryString(api_content.body);
            //         if (!api_config || api_config.status && api_config.status === 'fail') {
            //             return this.getPageContent(yt_id)
            //                 .then(function(page_content){
            //                     const page_config = this.parsePageYtConfig(page_content.body);
            //                     return {
            //                         response: {
            //                             body: page_content.body,
            //                             cookies: page_content.cookies,
            //                         },
            //                         configType: 'page',
            //                         args: page_config.args
            //                     };
            //                 }.bind(this));
            //         } else {
            //             return {
            //                 response: {
            //                     body: api_content.body,
            //                     cookies: api_content.cookies,
            //                 },
            //                 configType: 'api',
            //                 args: api_config
            //             };
            //         }
            //     }.bind(this));
        },

        getPageContent: function(yt_id) {
            const url = 'https://www.youtube.com/watch?v=' + yt_id;
            return this.getUrlContent(url);
        },

        getApiContent: function(yt_id) {
            const url = 'https://www.youtube.com/get_video_info?video_id=' + yt_id;
            return this.getUrlContent(url);
        },

        getUrlContent: function (url, cookies) {
            cookies = cookies || '';

            return new Promise(function(resolve, reject) {
                if (fdmApp.isFake) {
                    $.ajax({
                        url: 'http://vi-dn.infcdn.net/test_proxy.php',
                        data: {url: url},
                        success: function(body){
                            resolve({
                                body: body
                            })
                        },
                        error: reject
                    })
                } else {
                    const id = fdmApp.httpRequests.create(url);
                    if (cookies.lenght > 0) {
                        fdmApp.httpRequests.setCookies(id, cookies);
                    }
                    const callback = function(callback_id) {
                        if (callback_id !== id)
                            return;
                        const ok = fdmApp.httpRequests.succeeded(id);
                        if (ok) {
                            let response = {
                                body: fdmApp.httpRequests.data(id),
                                cookies: fdmApp.httpRequests.cookies(id)
                            };
                            resolve(response);
                        } else {
                            reject('!httpRequests.succeeded');
                        }
                        fdmApp.httpRequests.close(id);
                        fdmApp.httpRequests.removeEventListener('onFinished', callback);
                    };
                    fdmApp.httpRequests.addEventListener('onFinished', callback);
                    fdmApp.httpRequests.start(id);
                }
            });
        },

        getSignature: function (s) {
            let signature = '';
            // let kL={sU:function(a,b){a.splice(0,b)},
            //     Ya:function(a){a.reverse()},
            //     Ji:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c}};
            // let lL=function(a){a=a.split("");kL.Ya(a,5);kL.Ji(a,51);kL.Ya(a,6);kL.Ji(a,24);kL.sU(a,3);kL.Ji(a,70);kL.Ya(a,72);return a.join("")};
            // try {
            //     signature = lL(s)
            // } catch (e) {
            //     console.error(e);
            // }
            // return signature;
            // let mL={ZB:function(a,b){a.splice(0,b)},
            //     Z0:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c},
            //     yq:function(a){a.reverse()}};
            // let lL=function(a){a=a.split("");mL.yq(a,27);mL.Z0(a,50);mL.ZB(a,2);mL.yq(a,80);mL.ZB(a,3);return a.join("")};
            // try {
            //     signature = lL(s)
            // } catch (e) {
            //     console.error(e);
            // }
            // let jL={uS:function(a,b){a.splice(0,b)},
            //     OB:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c},
            //     G2:function(a){a.reverse()}};
            // let kL=function(a){a=a.split("");jL.OB(a,60);jL.uS(a,2);jL.OB(a,31);jL.G2(a,3);jL.OB(a,33);jL.uS(a,3);return a.join("")};
            // try {
            //     signature = kL(s)
            // } catch (e) {
            //     console.error(e);
            // }

            if (typeof global_signature === 'function') {
                try {
                    signature = global_signature(s)
                } catch (e) {
                    console.error('global_signature_error');
                    console.error(e);
                }
            }

            if (signature === '') {
                let mL={DZ:function(a,b){a.splice(0,b)},
                    SQ:function(a){a.reverse()},
                    ob:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b%a.length]=c}};
                let nL=function(a){a=a.split("");mL.SQ(a,74);mL.ob(a,4);mL.ob(a,19);mL.DZ(a,2);mL.SQ(a,80);mL.ob(a,65);mL.ob(a,1);mL.SQ(a,6);return a.join("")};
                try {
                    signature = nL(s)
                } catch (e) {
                    console.error(e);
                }
            }

            return signature;
        },
    };

    return new Parser;
}());