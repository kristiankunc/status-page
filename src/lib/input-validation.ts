export class InputValidator {
	static async isUrl(url: string): Promise<boolean> {
		return url.match(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
		)
			? true
			: false;
	}

	static async isAlphaNumeric(str: string): Promise<boolean> {
		// allow only letters, numbers, and spaces
		return str.match(/^[a-zA-Z0-9 ]+$/) ? true : false;
	}

	static async isUUID4(uuid: string): Promise<boolean> {
		return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
			? true
			: false;
	}
}
