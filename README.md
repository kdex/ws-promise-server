# ws-promise-server
`ws-promise-server` is a tiny framework that builds a request-response model onto HTML5 WebSockets using ES2015 Promises. You can use this with ES2017's `await`/`async` to simplify your WebSocket API.

The official client to use with this server is available at [kdex/ws-promise-client](https://github.com/kdex/ws-promise-client).

The protocol that servers and clients carry out is [kdex/ws-rpc-client](https://github.com/kdex/ws-rpc-client), a minimal RPC protocol.

# Getting started
The following code creates a WebSocket server and allows you to reply to a *specific* message sent by a client without you needing to put any kind of message ID anywhere.
```js
import WS from "ws-promise-server";
const server = new WS({
	port: 8080
});
(async () => {
	await server.open();
	server.on("connection", rpc => {
		rpc.on("computePrimes", async message => {
			try {
				const primes = await computePrimes();
				await message.reply(...primes);
				/* In this line, the client will have received the reply */
			}
			catch (e) {
				/* In this line, the client might have disconnected */
			}
		});
	});
})();
```
# API reference
#### WS.constructor(options)
Constructs a new `ws-promise-server` instance. The `options` argument will be passed to the constructor of [`ws`](https://www.npmjs.com/package/ws) once you open the connection.
#### async WS.prototype.open()
Starts listening. The entire `options` object will be passed to the constructor of [`ws`](https://www.npmjs.com/package/ws). Once the server is listening, the `Promise` will resolve. If there is an error, the `Promise` will reject.
#### async WS.prototype.close()
Closes the server by disconnecting all clients and closing the TCP socket. Once the port is free for use again, the `Promise` will resolve. If there is an error while closing, the `Promise` will reject.

#### Events
The following standard WebSocket **server** events can be handled with `on(event, handler)`:
- error
- headers
- connection

For a list of **client** events you can handle, check out the [RPC protocol](https://github.com/kdex/ws-rpc-client) that defines them.