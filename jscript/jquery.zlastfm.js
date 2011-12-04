/*
Plugin: jquery.zLastFM
*/

(function($){

	$.fn.lastfm = function(username, display, apikey, options) {	
	
		// Set pluign defaults
		var defaults = {
			limit: 5,	
			header: true,
			title: '',
			imagesize: 'medium',
			image: true,
			noimage: '',
			name: true,
			artist: true,
			playcount: true,
			showerror: true
		};  
		var options = $.extend(defaults, options); 
		
		// Functions
		return this.each(function(i, e) {
			var $e = $(e);
			
			// Add feed class to user div
			if (!$e.hasClass('lastFM')) $e.addClass('lastFM');

			// Get API method
			if (display == 'lovedtracks') {
				options.title = 'Loved Tracks';
				var method = 'user.getLovedTracks';

			} else if (display == 'recenttracks') {
				options.title = 'Recent Tracks';
				var method = 'user.getRecentTracks';

			} else if (display == 'topalbums') {
				options.title = 'Top Albums';
				var method = 'user.getTopAlbums';

			} else if (display == 'topartists') {
				options.title = 'Top Artists';
				var method = 'user.getTopArtists';

			} else if (display == 'toptracks') {
				options.title = 'Top Tracks';
				var method = 'user.getTopTracks';

			} else {
				if (options.showerror)  $e.html('<p>LastFM feed invalid</p>');
				return false;
			}

			// Create LastFM API address
			var api = 'http://ws.audioscrobbler.com/2.0/?method='+ method +'&user='+ username +'&api_key='+ apikey +'&limit='+ options.limit +'&format=json&callback=?';

			// Send request
			$.ajax({
				type: 'GET',
				url: api,
				dataType: 'json',
				success: function(data) {

					if (data) {

						// Process data depending on feed
						if (display == 'lovedtracks') {
							
							_callback(e, display, data.lovedtracks.track, options);

						} else if (display == 'recenttracks') {
						
							_callback(e, display, data.recenttracks.track, options);

						} else if (display == 'topalbums') {

							_callback(e, display, data.topalbums.album, options);

						} else if (display == 'topartists') {
		
							_callback(e, display, data.topartists.artist, options);

						} else if (display == 'toptracks') {

							_callback(e, display, data.toptracks.track, options);
						}

					} else {
						if (options.showerror) $e.html('<p>LastFM information unavailable</p>');
					}
				},
				error: function(data) {
					if (options.showerror)  $e.html('<p>LastFM request failed</p>');
				}
			});

		});
	};

	// Function to get feed items
	var _callback = function(e, display, feeds, options) {
		var $e = $(e);
		var row = 'odd';
		var html = '';

		// Add header if required
		html += '<div class="lastFMHeader">'+ options.title + '</div>';

		// Add feed container
		html += '<div class="lastFMBody '+ display +'">';
			
		if (feeds) {

			html += '<ul>';

			var count = feeds.length;
			if (count > options.limit) count = options.limit;
			
			// Add feeds
			for (var i=0; i<count; i++) {

				// Get individual feed
				var item = feeds[i];				

				html += '<li class="itemRow '+ row +'">';
				
			 	// Get feed data		
				var name = item.name;		
				var url = _getValidURL(item.url)
				var artist = '';
				var imgurl = '';
				var playcount = null;

				if (display == 'lovedtracks' || display == 'topalbums' || display == 'toptracks') {

					artist = '<a href="'+ _getValidURL(item.artist.url) +'" title="More about '+ item.artist.name +' on Last.FM">'+ item.artist.name +'</a>';
				} else if (display == 'recenttracks') {
			
					artist = item.artist['#text'];
				}
						
				if (display == 'topalbums' || display == 'topartists' || display == 'toptracks') playcount = item.playcount;

				// Add image
				if (options.image) {

					// Check for feed image url
					if (item.image) {

						// Get image index
						if (options.imagesize == 'small') {
							var imgindex = 0;
		
						} else if (options.imagesize == 'medium') {
							var imgindex = 1;
	
						} else if (options.imagesize == 'large') {
							var imgindex = 2;
	
						} else if (options.imagesize == 'extralarge') {
							var imgindex = 3;
						}	
						
						// Get image url or default
						imgurl = _getValidURL(item.image[imgindex]['#text']);
					}

					// Apply default image if requried
					if (imgurl == '') imgurl = options.noimage;
					if (imgurl != '') html += '<div class="imagesiz"><a href="#vidz" title="Listen to '+ item.name +' on Last.FM"><img src="'+ imgurl +'" alt="'+ item.name +'" /></a></div>'
				}
//'+ url +' - goes where #vidz is
				// Add name
				if (options.name) html += '<div class="itemName"><a href="'+ url +'" title="Listen to '+ item.name +' on Last.FM">'+ item.name +'</a></div>'

				// Add artist
				if (options.artist) html += '<div class="itemArtist">'+ artist +'</div>';

				// Add play count
				if (options.playcount && playcount != null) html += '<div class="itemPlaycount">'+ playcount +' plays</div>'

				html += '</li>';

				// Alternate row classes
				if (row == 'odd') { row = 'even'; } else { row = 'odd'; }
			}

			html += '</ul>';
			
		} else {
			html += '<p>No items to display</p>';e
		};


		html += '</div>';
		
		$e.append(html);
	};
	
	// Ensure URL is formatted correctly
	var _getValidURL = function(u) {

		var url = u;
		if (u != '' && u.substr(0,7) != 'http://') url = 'http://'+ u;

		return url;
	};
})(jQuery);
