const tmi = require('tmi.js');
const maxApi = require('max-api');
const ytdl = require('ytdl-core');
var client;



// Array to store chat messages with "!playlist" and YouTube links categorized as music
let playlistMessages = [];
let playlistTitles = []; // Array to store video titles
let connection = 0;

// Regular expression to match YouTube links
const youtubeLinkRegex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)(?:\/watch\?v=|\/)([^\s&]+)/i;

// Connect the client to Twitch





maxApi.addHandler("channel", (msg) => {
    maxApi.addHandler('connect', (msg) => {
        console.log("testing connection")
        maxApi.outlet('length', playlistTitles);
        //console.log(playlistMessages);
        client.disconnect();



    });





    client = new tmi.Client({
        options: { debug: true },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: 'cameronjxyz',
            password: 'oauth:2goxbsvd30nt4lg5cqdka5v7zg9pne'
        },
        channels: [msg]

    });

    client.connect();
    console.log("connected");




    client.on('message', async (channel, userstate, message, self) => {
        // Check if the message starts with "!playlist" and contains a YouTube link
        if (message.startsWith('!playlist')) {
            const youtubeMatch = message.match(youtubeLinkRegex);
            if (youtubeMatch) {
                const videoId = youtubeMatch[1];
                try {
                    const category = await checkVideoCategory(videoId);
                    if (category === 'Music') {
                        const youtubeLink = youtubeMatch[0]; // Full YouTube link

                        // Check if the message already exists in the playlistMessages array
                        if (!playlistMessages.includes(youtubeLink)) {
                            playlistMessages.push(youtubeLink);
                            // Fetch video title and add it to playlistTitles array
                            const info = await ytdl.getInfo(videoId);
                            const videoTitle = info.videoDetails.title;
                            playlistTitles.push(videoTitle);
                            console.log(`Added YouTube link and title to arrays: ${youtubeLink} - ${videoTitle}`);
                            // Handle the chat message with "!playlist", YouTube link, and categorized as music
                            maxApi.outlet('message', youtubeLink, videoTitle);
                        } else {
                            console.log(`Message already exists in the playlist: ${youtubeLink}`);
                        }
                    }
                } catch (error) {
                    console.error('Error checking video category or fetching video info:', error);
                }
            }
        }

        maxApi.outlet('length', playlistMessages.length);
        maxApi.outlet('array', playlistTitles);
    });


    client.on('messagedeleted', (channel, username, deletedMessage, userstate) => {
        // Check if the deleted message with YouTube link and categorized as music is in the array
        const index = playlistMessages.findIndex((item) => item === deletedMessage);
        if (index !== -1) {
            playlistMessages.splice(index, 1);
            playlistTitles.splice(index, 1); // Remove the corresponding video title
            console.log(`Removed deleted YouTube link and title from the arrays: ${deletedMessage}`);
            // Handle the removal of the deleted message
            // ...
            maxApi.outlet('length', playlistMessages.length);
            maxApi.outlet('array', playlistTitles);
        }
    });

    // Function to check the category of a YouTube video
    async function checkVideoCategory(videoId) {
        try {
            const info = await ytdl.getInfo(videoId);
            if (info && info.videoDetails && info.videoDetails.category === 'Music') {
                return 'Music';
            }
            return 'Other';
        } catch (error) {
            console.error('Error checking video category:', error);
            return 'Other';
        }
    }

});







// Listen for chat messages





maxApi.addHandler('index', (msg) => {
    //console.log(playlistMessages);
    ytdl.getInfo(playlistMessages[msg])
        .then((info) => {
            let format = ytdl.chooseFormat(info.formats, { quality: 18 });
            maxApi.outlet('download_url', format.url);
        })
        .catch(() => {
            maxApi.post(`Error fetching url: ${playlistMessages[msg]}`);
        });
});



maxApi.addHandler('refresh', (msg) => {
    maxApi.outlet('length', playlistMessages.length);
    maxApi.outlet('array', playlistTitles);
});
