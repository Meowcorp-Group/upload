import mainPage from './client/main.html'

const server = Bun.serve({
	routes: {
		"/": mainPage,
	}
});

console.log(`http://${server.hostname}:${server.port}`);