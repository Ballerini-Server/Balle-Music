export default class Playlist {
    constructor(data = {}, url) {
        this.name = data.name || "Unknown name"
        this.url = url
        this.type = data.type
    }
}