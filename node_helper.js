const NodeHelper = require('node_helper')
    const fetch = require('node-fetch')

    /* Fetch the KEXP currently playing track. */
    async function getKexpNowPlaying(context, userName, userEmail) {
    console.log('MMM-Kexp fetching now playing')
    console.log(`MMM-Kexp ${userName}, ${userEmail}`)
    fetch('https://api.kexp.org/play/?format=json&limit=1&ordering=-airdate', {
        headers: {
            'User-Agent': `${userName}'s Magic Mirror, contact ${userEmail}`
        }
    }).then(response => {
        console.log('MMM-Kexp: got response')
        if (!response.ok) {
            console.log('MMM-Kexp: response not ok')
            context.sendSocketNotification('FETCH_TRACK_ERROR', {
                "success": false,
                "error": `Failed to fetch track data. Response: ${response}`
            })
        }
        response.json().then(data => {
            console.log('MMM-Kexp: processing response data')
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
            console.log('MMM-Kexp: something failed getting track data')
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