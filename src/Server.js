import EventEmitter from "crystal-event-emitter";
import ServerClient from "./ServerClient.js";
let WebSocket = require("ws");
export class Server extends EventEmitter {
	constructor(options) {
		super({
			inferListeners: true
		});
		this.wss = new WebSocket.Server(options);
		for (let event of ["error", "headers", "connection"]) {
			this.wss.on(event, ws => {
				let client = new ServerClient(ws);
				this.emit(event, client);
			});
		}
	}
}
export default Server;