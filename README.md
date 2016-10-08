# ws-promise-server
`ws-promise-server` is a tiny framework that builds a request-response model onto HTML5 WebSockets using ES2015 Promises. You can use this with ES2017's `await`/`async` to simplify your WebSocket API.

The WebSocket implementation used by this project is [uWebSockets](https://github.com/uWebSockets/uWebSockets), since it outperforms all current implementations. The official client to use with this server is available at [kdex/ws-promise-client](https://github.com/kdex/ws-promise-client).

The protocol that servers and clients carry out is [kdex/ws-rpc-client](https://github.com/kdex/ws-rpc-client), a minimal RPC protocol.

# Getting started
The following code creates a server and allows you to reply to a *specific* message sent by a client without you needing to put any kind of message ID anywhere.
```js
import WS from "ws-promise-server";
const server = new WS({
	port: 8080
});
server.on("connection", rpc => {
	rpc.on("sayHello", message => {
		message.reply("Hello, client!");
	});
});
```
# API reference
#### WS.constructor(options)
Constructs a new `ws-promise-server` instance. The `options` argument will be passed to the constructor of [`uws`](https://github.com/uWebSockets/uWebSockets).

#### Events
The following standard WebSocket **server** events can be handled with `on(event, handler)`:
- error
- headers
- connection

For a list of **client** events you can handle, check out the [RPC protocol](https://github.com/kdex/ws-rpc-client) that defines them.