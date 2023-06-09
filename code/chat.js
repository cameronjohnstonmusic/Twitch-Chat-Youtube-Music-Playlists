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
    channels: ['cameronjxyz']
});

// Array to store chat messages with "!playlist" and YouTube links categorized as music
const playlistMessages = [];

// Regular expression to match YouTube links
const youtubeLinkRegex = /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com|\.be)(?:\/watch\?v=|\/)([^\s&]+)/i;

// Connect the client to Twitch
client.connect();

// Listen for chat messages
client.on('message', (channel, userstate, message, self) => {
    // Check if the message starts with "!playlist" and contains a YouTube link
    if (message.startsWith('!playlist')) {
        const youtubeMatch = message.match(youtubeLinkRegex);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            checkVideoCategory(videoId)
                .then((category) => {
                    if (category === 'Music') {
                        const youtubeLink = youtubeMatch[0]; // Full YouTube link
                        playlistMessages.push(youtubeLink);
                        console.log(`Added YouTube link to the array: ${youtubeLink}`);
                        // Handle the chat message with "!playlist", YouTube link, and categorized as music
                        // ...
                    }
                })
                .catch((error) => {
                    console.error('Error checking video category:', error);
                });
        }
    }
});

// Listen for message deletions
client.on('messagedeleted', (channel, username, deletedMessage, userstate) => {
    // Check if the deleted message with "!playlist", YouTube link, and categorized as music is in the array
    const index = playlistMessages.findIndex((item) => item.message === deletedMessage);
    if (index !== -1) {
        playlistMessages.splice(index, 1);
        console.log(`Removed deleted message with "!playlist", YouTube link, and categorized as music from the array: ${deletedMessage}`);
        // Handle the removal of the deleted message
        // ...
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
    console.log(playlistMessages);
    ytdl.getInfo(playlistMessages[msg % playlistMessages.length])
        .then((info) => {
            let format = ytdl.chooseFormat(info.formats, { quality: 18 });
            maxApi.outlet('download_url', format.url);
        })
        .catch(() => {
            maxApi.post(`Error fetching url: ${playlistMessages[msg]}`);
        });
});
