const NodeHelper = require('node_helper')
    const fetch = require('node-fetch')

    /* Fetch the KEXP currently playing track. */
    async function getKexpNowPlaying(context, userName, userEmail) {
    console.log('MMM-Kexp fetching now playing')
    fetch('https://api.kexp.org/play/?format=json&limit=1&ordering=-airdate', {
        headers: {
            'User-Agent': `${userName}'s Magic Mirror, contact ${userEmail}`
        }
    }).then(response => {
        if (!response.ok) {
            console.log('MMM-Kexp: failed to fetch KEXP track')
            context.sendSocketNotification('FETCH_TRACK_ERROR', {
                "success": false,
                "error": `Failed to fetch track data. Response: ${response}`
            })
        }
        response.json().then(data => {
            const trackData = data.results.pop()
                context.sendSocketNotification('FETCHED_TRACK', {
                "success": true,
                "error": null,
                "playtype": trackData.playtype ? trackData.playtype.name : null,
                "trackName": trackData.track ? trackData.track.name : null,
                "artistName": trackData.artist ? trackData.artist.name : null,
                "albumName": trackData.release ? trackData.release.name : null,
                "albumArtUri": trackData.release ? trackData.release.smallimageuri : null
            })
        }).catch(error => {
            console.log('MMM-Kexp: failed to read track data')
            context.sendSocketNotification('FETCH_TRACK_ERROR', {
                "success": false,
                "error": `Error fetching track data: ${error}`
            })
        })
    })
}

module.exports = NodeHelper.create({
    start: function () {},
    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
        case 'FETCH_KEXP':
            getKexpNowPlaying(this, payload.userName, payload.userEmail)
            break
        }
    },
})