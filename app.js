var redirect = 'http://downloader.soundcloud.ruud.ninja/callback.html';
var token    = null;
var limit    = 100;

$('#authorize').on('click', function() {
  SC.initialize({
    client_id:    'c205c3e2eedb509dff1c1147765b055d',
    redirect_uri: redirect
  });

  SC.connect()
      .then(function(session) {
        token = session.oauth_token;

        $('[data-hide="after-auth"]').hide();
        $('[data-show="after-auth"]').show();

        return SC.get('/me')
      })
      .then(function(data) {
        var track_count = (data.private_tracks_count || 0) + (data.track_count || 0);
        var pages       = Math.floor(track_count / limit);

        for(var page = 0; page <= pages; page++) {
          fetch_and_append(limit, page);
        }
      });
});

function fetch_and_append(limit, page) {
  SC.get('/me/tracks', {limit: limit, linked_partitioning: page})
      .then(function(data) {
        var track_list = $('#tracks');

        $('[data-hide="after-fetch"]').hide();
        $('[data-show="after-fetch"]').show();

        for(var index in data) {
          var track = data[index];

          var download_url = track.download_url;
          var title        = track.title;

          var append = '<li>';
          append += '<a href="' + download_url + '?oauth_token=' + token + '">' + title + '</a>';
          append += '</li>';

          track_list.append(append);
        }
      });
}
