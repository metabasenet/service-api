import Koa from 'koa'
import http from 'http'
import convert from 'koa-convert'
import logger from 'koa-logger'
import cors from 'koa-cors'
import bodyParser from 'koa-bodyparser'
import onerror from 'koa-onerror'
import { WebSocketServer } from 'ws'

import routes from './routes/index.js'
import config from '../config/config.js'


const app = new Koa()

onerror(app)
app.use(convert(cors()))
app.use(convert(logger()))
app.use(bodyParser())

app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(routes.routes(), routes.allowedMethods())

app.on('error', (error, ctx) => {
    console.log('error:' + JSON.stringify(ctx.onerror))
    console.log('server error:' + error)
})

const server = http.createServer(app.callback())

const ws_server = new WebSocketServer({ server })
ws_server.on("connection", (conn) => {
    conn.on("message", (ms) => {
        ws_server.clients.forEach(client => {
            if (client != conn) {
                client.send(ms.toString())
            }
        })
    })
})

server.listen(config.port).on('listening', () => {
    console.log(`listening: ${config.port}`)
})

export default app
