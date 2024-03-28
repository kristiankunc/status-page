import { error, redirect } from "@sveltejs/kit";
import prisma from "../lib/prsima";
import type { PageServerLoad, Actions } from "./$types";
import { InputValidator } from "$lib/input-validation";
import { page } from "$app/stores";
import { AuthHelper } from "$lib/auth";

export const load: PageServerLoad = async () => {
	const services = await prisma.service.findMany();

	return {
		services: services
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!AuthHelper.isAdmin(await locals.auth())) error(403, "Unauthorized");

		const formData = await request.formData();

		if (!formData.has("name") || !formData.has("endpoint")) error(400, "Missing required fields");
		if (!InputValidator.isUrl(formData.get("endpoint") as string)) error(400, "Invalid URL");
		if (!InputValidator.isAlphaNumeric(formData.get("name") as string)) error(400, "Invalid title");

		const service = await prisma.service.create({
			data: {
				name: formData.get("name") as string,
				endpoint: formData.get("endpoint") as string
			}
		});

		throw redirect(302, `/service/${service.id}`);
	}
};
