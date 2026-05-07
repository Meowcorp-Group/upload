import { jwtVerify } from 'jose';

import mainPage from './client/main.html'

const server = Bun.serve({
	routes: {
		"/": mainPage,
		"/verify-jwt": async (req) => {
			const token = await req.text();
			try {
				const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_HS256_PSK));
				return new Response(JSON.stringify(payload), {
					headers: { 'Content-Type': 'application/json' }
				});
			} catch (error) {
				console.log('Error:', error);
				return new Response('Invalid token', { status: 401, });
			}
		}
	}
});

console.log(`http://${server.hostname}:${server.port}`);