import { decodeJwt } from 'jose';

const authTokenInput = document.getElementById('auth-token-input') as HTMLTextAreaElement;
const authTokenStatus = document.getElementById('auth-token-status') as HTMLSpanElement;
const authTokenType = document.getElementById('auth-token-type') as HTMLSpanElement;
const authTokenUser = document.getElementById('auth-token-user') as HTMLSpanElement;
const authTokenExpiration = document.getElementById('auth-token-expiration') as HTMLSpanElement;
const authButton = document.getElementById('auth-button') as HTMLButtonElement;
const unauthenticatedSection = document.getElementById('unauthenticated-section') as HTMLDivElement;
const authenticatedSection = document.getElementById('authenticated-section') as HTMLDivElement;
const username = document.getElementById('username') as HTMLSpanElement;
const logoutButton = document.getElementById('logout-button') as HTMLButtonElement;

(async () => {
	const storedToken = localStorage.getItem('authToken');
	if (storedToken) {
		const response = await fetch('/verify-jwt', {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: storedToken
		});

		if (response.ok) {
			const payload = await response.json();
			console.log('Token verified successfully:', payload);
			unauthenticatedSection.classList.add('none');
			authenticatedSection.classList.remove('none');
			username.textContent = `${payload.username as string} (${payload.id as string})`;
		} else {
			console.warn('Stored token is invalid, clearing it');
			localStorage.removeItem('authToken');
		}
	}
})();

authTokenInput.addEventListener('input', () => {
	console.log('Token changed:', authTokenInput.value);

	if (authTokenInput.value.trim() === '') {
		authTokenStatus.textContent = 'Enter a token';
		authButton.disabled = true;
	} else {
		try {
			const decoded = decodeJwt(authTokenInput.value);
			authTokenStatus.textContent = 'Decoded token:';
			authButton.disabled = false;
			console.log('Decoded token:', decoded);
			authTokenType.textContent = decoded.type as string;
			authTokenUser.textContent = `${decoded.username as string} (${decoded.id as string})`;
			authTokenExpiration.textContent = new Date(decoded.expiration as number * 1000).toISOString();
		} catch (error) {
			authTokenStatus.textContent = 'Invalid token';
			authButton.disabled = true;
			console.error('Error decoding token:', error);
		}
	}
});

authButton.addEventListener('click', async () => {
	const token = authTokenInput.value.trim();

	if (authTokenStatus.textContent === 'Decoded token:') {
		try {
			const response = await fetch('/verify-jwt', {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: token
			});


			if (response.ok) {
				const payload = await response.json();
				console.log('Token verified successfully:', payload);
				localStorage.setItem('authToken', token);
				window.location.reload();
			} else {
				alert('Token verification failed');
			}
		} catch (error) {
			console.error('Error verifying token:', error);
			alert('An error occurred while verifying the token');
		}
	}
});

logoutButton.addEventListener('click', () => {
	localStorage.removeItem('authToken');
	window.location.reload();
});