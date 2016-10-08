import "babel-register";
import test from "ava";
import * as exports from "../src/index";
import Client from "ws-promise-client";
const { Server } = exports;
const port = 1234;
const server = new Server({
	port
});
function limit(promise) {
	const fail = new Promise((resolve, reject) => {
		setTimeout(() => {
			reject();
		}, 5000);
	})
	return Promise.race([promise, fail]);
}
function makeClient() {
	return new Client(`ws://localhost:${port}`);
}
test("There is both a default as well as a named export", t => {
	t.plan(1);
	if (Object.keys(exports).length !== 2) {
		t.fail();
	}
	else if (!exports.default || !exports.Server) {
		t.fail();
	}
	else if (exports.default !== exports.Server) {
		t.fail();
	}
	else {
		t.pass();
	}
});
test.serial("One client can connect to the server", async t => {
	t.plan(1);
	try {
		await limit(new Promise(async (resolve, reject) => {
			server.on("connection", () => {
				resolve();
			});
			const client = makeClient();
			await client.open();
		}));
		t.pass();
	}
	catch (e) {
		t.fail();
	}
});
test.serial("Many clients can connect to the server", async t => {
	const clientAmount = 100;
	t.plan(clientAmount + 1);
	try {
		await limit(new Promise(async (resolve, reject) => {
			server.on("connection", () => {
				t.pass();
			});
			const clients = new Set();
			for (let i = 0; i < clientAmount; ++i) {
				clients.add(makeClient());
			}
			const promises = Array.from(clients).map(c => c.open());
			resolve(await Promise.all(promises));
		}));
		t.pass();
	}
	catch (e) {
		t.fail();
	}
});
test.serial("The server can receive data from one client", async t => {
	t.plan(1);
	try {
		await limit(new Promise(async (resolve, reject) => {
			server.on("connection", rpc => {
				rpc.on("message", message => {
					const { payload } = message.data;
					const { instruction, args: [first, second, ...rest] } = payload;
					if (instruction === "answer" && !rest.length) {
						if (first === 1 && second === 2) {
							resolve();
						}
					}
				});
			});
			const client = makeClient();
			await client.open();
			client.send({
				instruction: "answer",
				args: [1, 2]
			});
		}));
		t.pass();
	}
	catch (e) {
		t.fail();
	}
});
test.serial("A single endpoint argument is transformed into an endpoint iterable", async t => {
	t.plan(1);
	try {
		await limit(new Promise(async (resolve, reject) => {
			server.on("connection", rpc => {
				rpc.on("message", message => {
					const { payload } = message.data;
					const { instruction, args: [first, ...rest] } = payload;
					if (instruction === "answer" && !rest.length) {
						if (first === 1) {
							resolve();
						}
					}
				});
			});
			const client = makeClient();
			await client.open();
			client.send({
				instruction: "answer",
				args: 1
			});
		}));
		t.pass();
	}
	catch (e) {
		t.fail();
	}
});
test.serial("The server can reply to a client", async t => {
	t.plan(1);
	try {
		await limit(new Promise(async (resolve, reject) => {
			server.on("connection", rpc => {
				rpc.on("message", async message => {
					try {
						await message.data.reply("two", "replies");
						resolve();
					}
					catch (e) {
						console.log(e);
						reject();
					}
				});
			});
			const client = makeClient();
			await client.open();
			const reply = await client.send({
				instruction: "question"
			});
			const [replyA, replyB] = reply.payload.args;
			if (replyA !== "two" || replyB !== "replies") {
				t.fail();
			}
		}));
		t.pass();
	}
	catch (e) {
		t.fail();
	}
});