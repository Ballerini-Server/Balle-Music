export default (manager) => {
    manager.on("event", data => {
        switch (data.type) {
            case "PlayerTrackStart":
                if(manager.listenerCount("PLAYER_TRACK_START")) manager.emit("PLAYER_TRACK_START", data.player, data.track)    
            break;

            case "PlayerTrackEnd":
                if(manager.listenerCount("PLAYER_TRACK_END")) manager.emit("PLAYER_TRACK_END", data.player, data.track)    
            break;

            case "PlayerQueueEnd":
                if(manager.listenerCount("PLAYER_QUEUE_END")) manager.emit("PLAYER_QUEUE_END", data.player)
            break;
        
            default:
                break;
        }
    })
}