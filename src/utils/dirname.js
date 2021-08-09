import path from "path"
import { URL } from "url"

export default function dirnameConfig() {
    const __dirname = ((_importMeta) => {
        let x = path.dirname(decodeURI(new URL(_importMeta.url).pathname)); 
        return path.resolve( (process.platform == "win32") ? x.substr(1) : x ); 
    })

    return global.__dirname = __dirname
}