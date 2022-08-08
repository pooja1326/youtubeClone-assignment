let params = (new URL(document.location)).searchParams;
let token = params.get("vid");
let token1 = params.get("cid");
$(document).ready(function () {
    console.log(1530431 / 1000000);
    const api_key = 'AIzaSyDt3048D53Cy9LV52cm2O7Xw5ZDmMfm9lk';
    // <--------------------------function---------------------------------->
    const videoDescription = (vedioData, channelData) => {
        const likes = vedioData.items[0].statistics.likeCount
        const totalcount = countLikes(likes);

        function countLikes(count) {

            let result = "";
            if (count >= 1000 && count < 1000000) {
                result = ((parseInt(count / 1000)) + 'k')
            } else if (count < 1000) {
                result = count;
            }
            else {
                result = ((parseFloat(count / 1000000))).toFixed(1) + 'm';

            }
            return result;
        }
        const n = vedioData.items[0].statistics.viewCount;
        const numberFormatter = Intl.NumberFormat('en-US');
        const formatted = numberFormatter.format(n);

        $('#h5title').text(vedioData.items[0].snippet.title);
        $('#video-views').text(formatted + ' views');
        $('#video-likes').text(' ' + totalcount);
        $('#channel_image').attr('src', channelData.items[0].snippet.thumbnails.default.url)
        $('#channel-title').text(channelData.items[0].snippet.title)
        $('#text-container').text(vedioData.items[0].snippet.description)
        $('#btn-1').click(function () {
            if ($('#text-container').hasClass("description-height")) {
                $('#btn-1').text("show Less");
                $('#text-container').removeClass("description-height");
            }
            else {
                $('#btn-1').text("show more");
                $('#text-container').addClass("description-height");
            }
        });
    }
    function getChannel(vedioData) {
        const videokey = {
            key: api_key,
            regionCode: "IN",
            id: token1,
            part: "snippet",
            maxResults: 1,
            relevanceLanguage: "hi",
            type: "video",
            videoSyndicated: true,
            videoEmbeddable: true,
        }
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/channels',
            data: videokey,
            success: function (channelData) {
                videoDescription(vedioData, channelData);
            },
            error: function (response) {
                console.log("Request Failed for search");
            }
        });
    }
    function getVideo() {
        const videokey = {
            key: api_key,
            regionCode: "IN",
            id: token,
            part: "statistics,snippet",
            maxResults: 1,
            relevanceLanguage: "hi",
            type: "video",
            videoSyndicated: true,
            videoEmbeddable: true,
        }
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/videos',
            data: videokey,
            success: function (vedioData) {
                getChannel(vedioData)
            },
            error: function (response) {
                console.log("Request Failed for search");
            }
        });
    }
    getVideo();
    embedVideo(token);
    function embedVideo(token) {
        const iframevalue = $("#iframeId")
        iframevalue.attr("src", `https://www.youtube.com/embed/${token}?autoplay=1`);
    }

});


