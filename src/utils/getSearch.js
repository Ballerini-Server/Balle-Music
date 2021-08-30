const searchSoundcloud = /^(.*?)--(soundcloud|sc)$/gi
const searchYouTubeMusic = /^(.*?)--(youtube\s?music|ytm)$/gi
const searchYouTube = /^(.*?)--(youtube|yt)$/gi
import { URL } from "url"

/**
 * 
 * @param {string} query 
 */
export default function getSearch(query) {
    let search;
    try {
        new URL(query)
        search = query
    } catch(_) {
        if(searchSoundcloud.test(query)) {
            search = `scsearch:${query.replace(searchSoundcloud, "$1").trim()}`
        } else if(searchYouTubeMusic.test(query)) {
            search = `ytmsearch:${query.replace(searchYouTubeMusic, "$1").trim()}`
        } else {
            search = `ytsearch:${query.replace(searchYouTube, "$1").trim()}`
        }
    }

    return search
}

/* 
if(args[args.length - 1].toLowerCase() == "--ytm") {
        args.pop()
        search = `ytmsearch:${args.join(" ")}`
*/