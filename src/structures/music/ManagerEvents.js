import LavalinkManager from "./LavalinkManager.js";

/**
 * @param {LavalinkManager} manager
 */
export default (manager) => {
    manager.on("event", data => {
        switch (data.type) {
            case "PlayerTrackStart":
                if(manager.client.listenerCount("playerTrackStart")) manager.client.emit("playerTrackStart", data.player, data.track)    
            break;

            case "PlayerTrackAdd":
                if(manager.client.listenerCount("playerTrackAdd")) manager.client.emit("playerTrackAdd", data.player, data.track)    
            break;

            case "PlayerTracksAdd":
                if(manager.client.listenerCount("playerTracksAdd")) manager.client.emit("playerTracksAdd", data.player, data.tracks)    
            break;

            case "PlayerTrackEnd":
                if(manager.client.listenerCount("playerTrackEnd")) manager.client.emit("playerTrackEnd", data.player, data,tarck)    
            break;

            case "PlayerTrackPause":
                if(manager.client.listenerCount("playerTrackPause")) manager.client.emit("playerTrackPause", data.player)
            break;

            case "PlayerQueueEnd":
                if(manager.client.listenerCount("playerQueueEnd")) manager.client.emit("playerQueueEnd", data.player)
            break;

            case "PlayerDestroy":
                if(manager.client.listenerCount("playerDestroy")) manager.client.emit("playerDestroy", data.player)
            break;
            
            case "NodeDisconect":
                if(manager.client.listenerCount("nodeDisconect")) manager.client.emit("nodeDisconect", data.node, data.event)
            break;

            default:
                break;
        }
    })
}