Module.register('MMM-Kexp', {
    defaults: {
        userName: 'User',
        userEmail: 'user@emailprovider.com'
    },
    start: function () {
        this.success = false
            this.error = null
            this.trackName = null
            this.artistName = null
            this.albumName = null
            this.albumArtUri = null
    },

    getStyles: function () {
        return ['MMM-Kexp.css']
    },

    getDom: function () {
        var kexpElement = document.createElement('div')
            kexpElement.id = 'KEXP'
            kexpElement.classList.add('kexp')

            var textDiv = document.createElement('div')
            textDiv.classList.add('trackinfo')

            var trackNameElement = document.createElement('p')
            trackNameElement.id = 'TRACK_NAME'
            trackNameElement.classList.add('bold')
            textDiv.appendChild(trackNameElement)

            var artistElement = document.createElement('p')
            artistElement.id = 'ARTIST'
            artistElement.classList.add('artist')
            textDiv.appendChild(artistElement)

            var albumElement = document.createElement('p')
            albumElement.id = 'ALBUM'
            albumElement.classList.add('light')
            albumElement.classList.add('album-name')
            textDiv.appendChild(albumElement)

            kexpElement.appendChild(textDiv)

            var imgDiv = document.createElement('div')
            imgDiv.classList.add('albumart')
            var albumArt = document.createElement('img')
            albumArt.id = 'ALBUM_ART'
            imgDiv.appendChild(albumArt)
            kexpElement.appendChild(imgDiv)

            return kexpElement
    },

    getHeader: function () {
        return 'Now playing on KEXP'
    },

    notificationReceived: function (notification, payload, sender) {
        switch (notification) {
        case 'DOM_OBJECTS_CREATED':
            setInterval(() => {
                this.sendSocketNotification('FETCH_KEXP', {
                    "userName": this.config.userName,
                    "userEmail": this.config.userEmail
                })
            }, 10 * 1000)
            break
        }
    },

    socketNotificationReceived: function (notification, payload) {
        switch (notification) {
        case 'FETCHED_TRACK':
            console.log('MMM-Kexp: Fetched track')
            var trackName = document.getElementById('TRACK_NAME')
                var artist = document.getElementById('ARTIST')
                var albumName = document.getElementById('ALBUM')
                var albumArt = document.getElementById('ALBUM_ART')
                if (payload.playtype == 'Air break') {
                    trackName.innerHTML = 'Air break'
                        artist.innerHTML = ''
                        albumName.innerHTML = ''
                        albumArt.src = ''
                        albumArt.style.display = 'none'
                } else if (payload.playtype) {
                    trackName.innerHTML = payload.trackName ? payload.trackName : ''
                        artist.innerHTML = payload.artistName ? payload.artistName : ''
                        albumName.innerHTML = payload.albumName ? payload.albumName : ''
                        if (payload.albumArtUri) {
                            albumArt.src = payload.albumArtUri
                                albumArt.style.display = 'initial'
                        } else {
                            albumArt.src = ''
                                albumArt.style.display = 'none'
                        }
                }
                break
            case 'FETCH_TRACK_ERROR':
                console.log(`MMM-Kexp: ${payload.error}`)
                break
        }
    },
})