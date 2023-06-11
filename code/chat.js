const tmi = require('tmi.js');
const maxApi = require('max-api');
const ytdl = require('ytdl-core');

// Create a Twitch client
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'cameronjxyz',
        password: 'oauth:2goxbsvd30nt4lg5cqdka5v7zg9pne'
    },
    channels: ['atrioc']
});

// Array to store chat messages with "!playlist" and YouTube links categorized as music
const playlistMessages = [];
const playlistTitles = []; // Array to store video titles

// Regular expression to match YouTube links
const youtubeLinkRegex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)(?:\/watch\?v=|\/)([^\s&]+)/i;

// Connect the client to Twitch

maxApi.addHandler('connect', (msg) => {
    if (msg == 1) {
        client.connect();
    }
    if (msg == 0) {
        client.disconnect();
    }
});






// Listen for chat messages



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
