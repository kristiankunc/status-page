import { AUTHORIZED_EMAILS } from "$env/static/private";
import type { Session } from "@auth/sveltekit";

export class AuthHelper {
	public static isAdmin(session: Session | null): boolean {
		if (!session) return false;
		if (!session.user || !session.user.email) return false;

		return AUTHORIZED_EMAILS.split(" ").includes(session.user.email);
	}
}
