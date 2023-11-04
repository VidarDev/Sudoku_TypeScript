import { join } from "node:path"
import { WatchEventType, watch, FSWatcher } from "node:fs"
import type { ServerWebSocket, Server } from "bun"

const serverPort: string | undefined = process.env.PORT
const baseDir = join(import.meta.dir, "www") // Path du répertoire du index.html

const wsClients: Set<ServerWebSocket> = new Set()
const serverWatcher: FSWatcher = watch(
    baseDir,
    { recursive: true },
    (event: WatchEventType, data: string | Error | undefined) => {
        console.log("Something has changed in :", data) // Si, il y a un changement dans le code source
        wsClients.forEach((ws: ServerWebSocket) => ws.send("reload"))
    }
)
process.on("SIGINT", () => process.exit(0)) // ctrl + c : Interruption du serveur

const server = Bun.serve({
    port: serverPort,
    development: true, // Mode développement pour la compilation

    async fetch(req: Request, srv: Server) {
        if (srv.upgrade(req)) { return }

        const url: URL = new URL(req.url)
        const filename: string = url.pathname === "/" ? "/index.html" : url.pathname
        const filePath: string = join(baseDir, filename)
        const fileToServe = Bun.file(filePath)

        // Si un fichier a une error 404 au chargement
        if (!(await fileToServe.exists())) {
            return new Response(
                `Unknown file : "${filePath}"`,
                {status: 404}
            )
        }

        return new Response(fileToServe)
    },

    websocket: {
        open(ws: ServerWebSocket) {
            wsClients.add(ws)
        },
        close(ws: ServerWebSocket) {
            wsClients.delete(ws)
        },
        message(ws: ServerWebSocket, message: string) {
            if (message !== "ping") {
                console.log(`Message received from "${server.hostname}:${server.port}" : "${message}"`)
            }
            ws.send("Well received")
        }
    }
})
console.log(`${process.env.PROTOCOL?.toUpperCase()} Server listening on ${server.hostname}:${server.port}`)
