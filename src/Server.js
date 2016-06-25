import EventEmitter from "crystal-event-emitter";
import RPCClient from "ws-rpc-client";
import { Server as WebSocketServer } from "ws";
export class Server extends EventEmitter {
	constructor(options) {
		super({
			inferListeners: true
		});
		this.wss = new WebSocketServer(options);
		for (let event of ["error", "headers", "connection"]) {
			this.wss.on(event, ws => {
				const client = new RPCClient(ws, options.rpcOptions);
				this.emit(event, client);
			});
		}
	}
}
export default Server;