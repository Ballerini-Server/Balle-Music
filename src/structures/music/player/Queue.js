import Player from "./Player.js"

export default class Queue extends Array {
  /**
   * 
   * @param {Player} player 
   * @param  {...any} args 
   */
    constructor(player) {
      super()
      this.previous = null
      this.current = null
      this.next = null
      this.player = player
    }

    push(args) {
      if(Array.isArray(args)) {
        args = args.flat(Infinity)
        args.map(x => super.push(x)) 
        if(this.player.manager.listenerCount("event")  && this.length != args.length) this.player.manager.emit("event", {
          type: "PlayerTracksAdd",
          player: this.player,
          tracks: args
        })
      } else {
        super.push(args)
        if(this.player.manager.listenerCount("event") && this.length != 1) this.player.manager.emit("event", {
          type: "PlayerTrackAdd",
          player: this.player,
          track: args
        })
      }
    }

    get duration() {
        let a, b
        const current = (b = (a = this.current) === null || a === void 0 ? void 0 : a.duration) !== null && b !== void 0 ? b : 0
        return this.reduce((acc, cur) => acc + (cur.duration || 0), current)
    }
}