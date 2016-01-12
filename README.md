# ws-promise-server
`ws-promise-server` is a tiny framework that builds a request-response model onto HTML5 WebSockets using ES2015 Promises. You can use this with ES2016's `await`/`async` to simplify your WebSocket API. Browsers, `node.js` and `io.js` environments are supported at the moment.

The API accepts both primitives and Objects; JSON serialization is automatically handled. The WebSocket implementation used by this project is [websockets/ws](https://github.com/websockets/ws). The official client to use with this server can be found at [kdex/ws-promise-client](https://github.com/kdex/ws-promise-client).

# Getting started
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
# API reference
#### WS.constructor(options)
Constructs a new `ws-promise-server` instance. The `options` argument is an optional object with the following keys:
##### resolveAfterReply (default: true)
Boolean property that determines whether to resolve promsies once the *first* reply has been received. Note that you can also regulate this on a message basis; this option will only be honored if you don't explicitly specify it on <a "href="#wsprototypesend">send</a>.
#### WS.prototype.send(body)
Sends the message payload to the client. If the payload can be parsed by `JSON-parse`, it will automatically turn into an `Object`.

#### Events
The following standard WebSocket **server** events can be handled with `on(event, handler)`:
- error
- headers
- connection

The following standard WebSocket **client** events can be handled with `on(event, handler):
- error
- close
- open
- message