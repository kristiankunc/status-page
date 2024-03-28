import type { LayoutServerLoad } from "./$types";
import { AUTHORIZED_EMAILS } from "$env/static/private";

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	const isAdmin = session && AUTHORIZED_EMAILS.split(" ").includes(session.user?.email || "");

	return {
		session: session,
		isAdmin: isAdmin || false
	};
};
