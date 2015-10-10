# ws-promise-server
`ws-promise-server` is a tiny framework that builds a request-response model onto HTML5 WebSockets using ES2015 Promises. You can use this with ES2016's `await`/`async` to simplify your WebSocket API. Browsers, `node.js` and `io.js` environments are supported at the moment.

The API accepts both primitives and Objects; JSON serialization is automatically handled. The WebSocket implementation used by this project is [ws](https://github.com/websockets/ws). The official client to use with this server can be found at [kdex/ws-promise-client](https://github.com/kdex/ws-promise-client).
# Getting started
Creating
```js
import WS from "ws-promise-server";
let server = new WS({
	port: 8080
});
server.on("connection", ws => {
	ws.on("message", msg => {
		msg.reply("Hello, I'm a server!");
	});
});
```
This code creates a server and allows you to reply to a specific message sent by a client without you needing to put any kind of message ID anywhere.