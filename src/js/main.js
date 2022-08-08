$(document).ready(function () {
    const video_list = $('#cardv');
    const searchInput = $('.search-bar');
    const api_key = 'AIzaSyDt3048D53Cy9LV52cm2O7Xw5ZDmMfm9lk';

    function timeDifference(previousDate) {
        let current = new Date();
        let previous = new Date(previousDate);
        let msPerMinute = 60 * 1000;
        let msPerHour = msPerMinute * 60;
        let msPerDay = msPerHour * 24;
        let msPerMonth = msPerDay * 30;
        let msPerYear = msPerDay * 365;
        let elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + " seconds ago";
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + " minutes ago";
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + " hours ago";
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + " day ago";
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + " month ago";
        } else {
            return Math.round(elapsed / msPerYear) + " year ago";
        }
    }
    const makevideocard = (data) => {
        const date = data.snippet.publishTime;
        const days = timeDifference(date);
        const videodata = `
    <div class = "col-lg-3 col-md-4 col-sm-12 col-12 card-padding">
    <a href="index2.html?vid=${data.id.videoId}&cid=${data.snippet.channelId}" class="card mt-2">
    <img  class="card-video"  src="${data.snippet.thumbnails.high.url}"> 
     <div class="card-video-details d-flex mt-2">
     <div  class="video-icon">
      <img  class= "video-image rounded-circle" src="${data.channelThumbnail}" >
      </div>
        <div class="content">
      <h6 class= "video-title text-dark"> ${data.snippet.title} </h6>
           <div class= "text-muted" >${data.snippet.channelTitle} </div>
           <div class= "text-muted" >${days} </div> 
         </div>
      </div>
   </a>
   </div>`;
        video_list.append(videodata);
    }
    const getchannelIcon = (videoData) => {
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/channels',
            data: {
                key: api_key,
                part: 'snippet',
                id: videoData.snippet.channelId
            },
            success: function (data) {
                videoData.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
                makevideocard(videoData);
            },
            error: function (response) {
                console.log("Request Failed for channel");
            }
        });
        const videochannelIcon = (video_views) => {
            $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/videos',
                data: {
                    key: api_key,
                    part: 'snippet',
                    id: videoData.items.id
                },
                success: function (_data) {

                    _data.count = _data.items[0].statistics.viewCount;
                    makevideocard(_data);
                    console.log(_data.items[0].statistics.viewCount)
                },
                error: function (response) {
                    console.log("Request Failed for channel");
                }
            });
        }
    }

    function getVideo(searchValue = '') {
        const videoKey = {
            key: api_key,
            q: searchValue,
            regionCode: "IN",
            part: "snippet",
            maxResults: 5,
            relevanceLanguage: "hi",
            type: "video",
            videoSyndicated: true,
            videoEmbeddable: true,
        }
        $.ajax({
            type: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/search',
            data: videoKey,

            success: function (data) {
                let channelsid = "";
                const arrayChannelId = data.items.map((eitem) => {
                    return eitem.snippet.channelId;
                });
                channelsid = arrayChannelId.join(',');
                $.ajax({
                    type: 'GET',
                    url: 'https://www.googleapis.com/youtube/v3/channels',
                    data: {
                        key: api_key,
                        part: 'snippet',
                        id: channelsid
                    },
                    success: function (v_data) {
                        data.items.forEach(element => {
                            v_data.items.forEach(el => {
                                if (element.snippet.channelId === el.id) {
                                    element.channelThumbnail = el.snippet.thumbnails.default.url;
                                }
                            });
                            //   console.log(element.snippet.channelId)
                            makevideocard(element);
                        });

                    },
                    error: function (response) {
                        console.log("Request Failed for channel");
                    }
                });
            },
            error: function (response) {
                console.log("Request Failed for search");
            }
        });
    }
    getVideo();
    $('.search-btn').click(function () {
        video_list.html(' ');
        getVideo(searchInput.val());
    });


});

