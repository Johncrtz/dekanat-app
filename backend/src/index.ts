import { Core, EventSystem } from "@intutable/core"
import net from "net"
import path from "path"
import process from "process"

const PLUGIN_PATHS = [
    path.join(__dirname, "../../node_modules/@intutable/*"),
    path.join(__dirname, "../../dekanat-app-plugin"),
]
const PG_PORT = 5432
const RETRIES = Math.pow(2, 30)

main()

/**
 * Start a {@link Core}. Since we have the HTTP plugin installed, it will keep
 * running and listen for requests.
 */
async function main() {
    await waitForDatabase().catch(e => crash<Core>(e))
    const devMode = process.argv.includes("dev") // what could go wrong?
    const events: EventSystem = new EventSystem(devMode) // flag sets debug mode
    await Core.create(PLUGIN_PATHS, events).catch(e => crash<Core>(e))
}

async function waitForDatabase() {
    let connected = false
    let lastError: unknown
    let retries = RETRIES
    while (retries > 0 && !connected) {
        console.log(`waiting for database...`)
        console.log(`retries: ${retries}`)
        await testPort(PG_PORT)
            .then(() => {
                connected = true
            })
            .catch(e => {
                lastError = e
            })
        await new Promise(res => setTimeout(res, 3000))
        retries--
    }
    if (connected) {
        return
    } else {
        return Promise.reject({
            error: {
                message: "could not connect to database",
                reason: lastError,
            },
        })
    }
}

async function testPort(port: number, host?: string) {
    let socket: net.Socket
    return new Promise((res, rej) => {
        socket = net.createConnection(port, host)
        socket
            .on("connect", function (e: Event) {
                res(e)
                socket.destroy()
            })
            .on("error", function (e: Event) {
                rej(e)
                socket.destroy()
            })
    })
}

function crash<A>(e: Error): A {
    console.log(e)
    return process.exit(1)
}
