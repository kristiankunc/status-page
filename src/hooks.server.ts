import { SvelteKitAuth } from "@auth/sveltekit";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import Google from "@auth/core/providers/google";

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
	logger: {
		error(error) {
			console.error("ERROR: ", error);
		},
		warn(code) {
			console.warn("WARN: ", code);
		},
		debug(code, metadata) {
			console.debug("DEBUG: ", code, metadata);
		}
	}
});
