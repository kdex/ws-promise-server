import {
	default as EventEmitter,
	ANY
} from "crystal-event-emitter";
import RPCClient from "ws-rpc-client";
import { Server as WebSocketServer } from "ws";
export class Server extends EventEmitter {
	constructor(options) {
		super({
			inferListeners: true
		});
		this.wss = new WebSocketServer(options);
		for (const event of ["error", "headers"]) {
			/* Forward some original events */
			this.wss.on(event, ws => this.emit(ws));
		}
		this.wss.on("connection", ws => {
			/* Forward connection events with RPCClients */
			const client = new RPCClient(ws, options.rpcOptions);
			this.emit("connection", client);
			/* Forward RPCClient events */
			client.on(ANY, e => {
				this.emit(e);
			});
		});
	}
}
export default Server;