$(document).ready(function () {
  $('#test').lastfm('USERNAME','topartists','LASTFMKEY', {
    noimage: 'noimage.gif',
    imagesize: 'extralarge',
    limit: '20'
  });
});

$('body').delegate('#vidz', 'click', function(e) {
$("#vidz").children('a').html(''); 
video.pause();
});
//search
$('body').delegate('.itemRow', 'click', function(e) 
{
/*e.preventDefault();*/
var inputs = $(this).children('.itemName').text();
$('.lastFMHeader').html(inputs);
console.log(inputs + ' + music');


var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+inputs+ ' music video' + '&format=5&max-results=1&v=2&alt=jsonc'; 

$.ajax
({
type: "GET",
url: yt_url,
dataType:"jsonp",
success: function(response)
{

if(response.data.items)
{
$.each(response.data.items, function(i,data)
{
var video_id=data.id;
var video_title=data.title;
var video_viewCount=data.viewCount;
// IFRAME Embed for YouTube
var video_frame="<iframe width='640' height='385' src='http://www.youtube.com/embed/"+video_id+"' frameborder='0' type='text/html'></iframe>";

var final= video_frame;

$("#vidz").children('a').html(final); // Result

});
}
else
{
$("#result").children('a').html("<div id='no'>No Video</div>");
}
}
});
});