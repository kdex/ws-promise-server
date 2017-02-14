import EventEmitter from "crystal-event-emitter";
import RPCClient, { ANY } from "ws-rpc-client";
import { Server as WebSocketServer } from "ws";
export class Server extends EventEmitter {
	constructor(options) {
		super({
			inferListeners: true
		});
		this.options = options;
	}
	async open() {
		return new Promise((resolve, reject) => {
			this.wss = new WebSocketServer(this.options, error => {
				for (const event of ["error", "headers"]) {
					/* Forward some original events */
					this.wss.on(event, ws => this.emit(ws));
				}
				this.wss.on("connection", ws => {
					/* Forward connection events with RPCClients */
					const client = new RPCClient(ws, this.options.rpcOptions);
					this.emit("connection", client);
					/* Forward RPCClient events */
					client.on(ANY, e => {
						const { data } = e;
						if (data) {
							if (e.raw) {
								/* Proxy generalized `message` event */
								this.emit("message", data);
							}
							else {
								/* Proxy specialized instruction event */
								const { instruction } = data.payload;
								/* I'm not sure about this line, but it works. */
								client.emit(instruction, data);
							}
						}
						else {
							/*
							* Don't do anything. No data ⇒ It's not a message event.
							* This case should be handled by the event listeners on
							* `this.ws` already.
							*/
						}
					});
				});
				if (error) {
					reject(error);
				}
				else {
					resolve();
				}
			});
		});
	}
	async close() {
		return new Promise((resolve, reject) => {
			this.wss.close(error => {
				if (error) {
					reject(error);
				}
				else {
					resolve();
				}
			});
		});
	}
}
export default Server;