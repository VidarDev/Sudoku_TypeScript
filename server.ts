import { join } from 'node:path';
import { WatchEventType, watch, FSWatcher } from "node:fs";
import { ServerWebSocket, Server } from 'bun';

const port: number = parseInt(process.argv[2]);
const baseDir = join(import.meta.dir, "www");

const wsClients: Set<ServerWebSocket> = new Set();
const watcher: FSWatcher = watch(
    baseDir,
    { recursive: true },
    (event: WatchEventType, data: string | Error | undefined) => {
        console.log("Something changed", data);
        wsClients.forEach((ws: ServerWebSocket) => ws.send("reload"));
    }
)
process.on("SIGINT", () => watcher.close())

const server = Bun.serve({
    port: 5000 | port,
    async fetch(req: Request, srv: Server) {
        if(srv.upgrade(req)) {
            return
        }
        const url = new URL(req.url);
        const filename = url.pathname === "/"
            ? "/index.html"
            : url.pathname;
        const filePath = join(baseDir, filename);
        //console.log(filePath);
        const file = Bun.file(filePath); // Read the file index.html
        if(!(await file.exists())) {
            return new Response(await
                    `Not Found "${filePath}"`,
                { status: 404 }
            );
        }
        return new Response(file);
    },
    websocket: {
        open(ws: ServerWebSocket) {
            wsClients.add(ws);
        },
        close(ws: ServerWebSocket) {
            wsClients.delete(ws);
        },
        message(ws: ServerWebSocket, message: string) {
            console.log(`Message received from"${ws.remoteAddress}": "${message}`);
            ws.send("Well received")
        }
    }
})
console.log(`HTTP Server listening on ${server.hostname}:${server.port}`);