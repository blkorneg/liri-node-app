//Import required JS,APIs,Config files etc
var dotenv    = require("dotenv").config();
var keys      = require("./key.js");
var Twitter   = require("twitter");
var Spotify   = require('node-spotify-api');
var Request   = require("request");
var fs        = require('fs');

//Initalize twitter and spotify with respective keys
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

//Capture Arguments from command line
var command = process.argv[2];
var query = process.argv[3] ? process.argv[3] : "big_time29";

//using command pattern
var liriManager = {
  // request myTweets info
    myTweets: function(screenName) {
        var params = {screen_name: screenName};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
          if (!error) {
            for (var i=0; i < tweets.length; i++) {
            console.log(tweets[i].text);
          }
        }
      });
    },

    // request song info
    spotifyThisSong: function(songName){;
      spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } else {
                var trackList = data.tracks.items;
                //Not sure why I can append Preview without creating var
                var preview = trackList[0].preview_url ? trackList[0].preview_url : "Preview not available";
                console.log("Title: " + trackList[0].name + "\nAlbum: " + trackList[0].album.name + "\nArtist: " + "\nPreview: " + preview);
        }

      });
    },

    //request movie info
    movieThis: function(movieName) {
      if (movieName === 'big_time29'){
          console.log ("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/ " +
          "\nIt's on Netflix");
      } else {
      // Then run a request to the OMDB API with the movie specified
        Request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

              // Parse the body getting items per requirments
              console.log("Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating +
              "\nRotten Tomatoes: " + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " +
              JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors : " + JSON.parse(body).Actors);
            }
        });
      }
    },

    // request doWhatItSays info
    doWhatItSays: function(doCommand) {
      fs.readFile('random.txt', (error, data) => {
    		if (error) {
    			throw error
    		};

  		  // Data is an buffer. Conver to string and split on the comma to create an array
  		  var randomTxt = data.toString().split(',');
  		  command = randomTxt[0];
  		  query = randomTxt[1];

        liriManager.execute(command,query);

      });
    }
  };

  // abstracting the API for decoupling
  liriManager.execute = function ( name ) {
      return liriManager[name] && liriManager[name].apply(liriManager, [].slice.call(arguments, 1) );
  };

  liriManager.execute(command,query);
