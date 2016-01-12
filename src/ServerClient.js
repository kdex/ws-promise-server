import WebSocket from "ws";
import EventEmitter from "crystal-event-emitter";
export class ServerClient extends EventEmitter {
	constructor(ws, {
		resolveAfterReply = true
	} = {}) {
		super({
			inferListeners: true
		});
		this.ws = ws;
		this.isFinished = false;
		for (let event of ["close", "error", "message", "open"]) {
			let name = `on${event}`;
			this.ws[name] = e => {
				let payload;
				let message;
				let body;
				let autoFinish;
				try {
					payload = JSON.parse(e.data);
					body = JSON.parse(payload.body);
					autoFinish = payload.resolveAfterReply;
					message = payload.message;
				}
				catch (e) {
					payload = e.data;
					autoFinish = resolveAfterReply;
					message = null;
					body = null;
				}
				let replyToMessage = (body, finish = false) => {
					if (this.isFinished) {
						throw new Error("Unable to finish message: Message has already been finished.");
					}
					else {
						let isFinished = finish || autoFinish;
						this.send({
							message,
							body,
							isFinished: finish || autoFinish
						});
						this.isFinished = isFinished;
					}
				}
				this.emit(event, {
					payload,
					body,
					message,
					event: e,
					reply: body => replyToMessage(body),
					finish: body => {
						replyToMessage(body, true);
					}
				});
			};
		}
	}
	send(body) {
		this.ws.send(JSON.stringify(body));
	}
}
export default ServerClient;