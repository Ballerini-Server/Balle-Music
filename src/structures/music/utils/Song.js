import { URL } from "url"

class Song {
    constructor(track = {}, requester, res, query) {
        this.title = track.info.title || "Unknown Title"
        this.author = track.info.author || "Unknown Artist"
        this.duration = track.info.length
        this.url = track.info.uri
        this.identifier = track.info.identifier
        this.artwork = track.info.artwork
        this.source = track.info.source
        this.isStream = track.info.isStream
        this.isSeekable = track.info.isSeekable
        this.track = track.track
        this.playlist = null
        this.requester = requester
        if(res.loadType == "PLAYLIST_LOADED" && query && res.playlistInfo) this.playlist = new Playlist(res.playlistInfo, query)
    }
}

class Playlist {
    constructor(data = {}, url) {
        this.name = data.name || "Unknown name"
        this.url = url
        this.type = data.type
    }
}

export default {
    Song: Song,
    Playlist: Playlist
}