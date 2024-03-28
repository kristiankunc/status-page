import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { InputValidator } from "$lib/input-validation";
import prisma from "$lib/prsima";
import { AuthHelper } from "$lib/auth";

export const load: PageServerLoad = async ({ params }) => {
	if (!params.id) error(400, "Missing required fields");
	if (!InputValidator.isUUID4(params.id)) error(400, "Invalid ID");

	const service = await prisma.service.findUnique({
		where: {
			id: params.id
		}
	});

	if (!service) error(404, "Not found");

	const records = await prisma.record.findMany({
		where: {
			serviceId: params.id
		},
		orderBy: {
			createdAt: "desc"
		}
	});

	const incidents = await prisma.incident.findMany({
		where: {
			serviceId: params.id
		},
		orderBy: {
			startAt: "desc"
		},
		include: {
			IncidentComment: {
				orderBy: {
					createdAt: "desc"
				}
			}
		}
	});

	return {
		service: service,
		records: records,
		incidents: incidents
	};
};

export const actions: Actions = {
	delete: async ({ request, locals, params }) => {
		if (!AuthHelper.isAdmin(await locals.auth())) error(403, "Unauthorized");

		const serviceId = params.id;
		if (!serviceId) error(400, "Missing required fields");

		await prisma.record.deleteMany({
			where: {
				serviceId: serviceId
			}
		});

		await prisma.incidentComment.deleteMany({
			where: {
				incident: {
					serviceId: serviceId
				}
			}
		});

		await prisma.incident.deleteMany({
			where: {
				serviceId: serviceId
			}
		});

		await prisma.service.delete({
			where: {
				id: serviceId
			}
		});

		throw redirect(302, "/");
	},

	edit: async ({ request, locals, params }) => {
		if (!AuthHelper.isAdmin(await locals.auth())) error(403, "Unauthorized");

		const serviceId = params.id;
		if (!serviceId) error(400, "Missing required fields");

		const formData = await request.formData();

		if (!formData.has("name") || !formData.has("endpoint")) error(400, "Missing required fields");
		if (!InputValidator.isUrl(formData.get("endpoint") as string)) error(400, "Invalid URL");
		if (!InputValidator.isAlphaNumeric(formData.get("name") as string)) error(400, "Invalid title");

		await prisma.service.update({
			where: {
				id: serviceId
			},
			data: {
				name: formData.get("name") as string,
				endpoint: formData.get("endpoint") as string
			}
		});

		throw redirect(302, `/service/${serviceId}`);
	},
	incident: async ({ request, locals, params }) => {
		if (!AuthHelper.isAdmin(await locals.auth())) error(403, "Unauthorized");

		const serviceId = params.id;
		if (!serviceId) error(400, "Missing required fields");

		const formData = await request.formData();

		await prisma.incident.create({
			data: {
				serviceId: serviceId,
				title: (formData.get("title") as string) || undefined
			}
		});

		throw redirect(302, `/service/${serviceId}`);
	},

	comment: async ({ request, locals, params }) => {
		if (!AuthHelper.isAdmin(await locals.auth())) error(403, "Unauthorized");

		const serviceId = params.id;
		if (!serviceId) error(400, "Missing required fields");

		const formData = await request.formData();

		if (!formData.has("content") || !formData.has("incidentId"))
			error(400, "Missing required fields");

		await prisma.incidentComment.create({
			data: {
				incidentId: formData.get("incidentId") as string,
				content: formData.get("content") as string
			}
		});

		throw redirect(302, `/service/${serviceId}`);
	},

	resolve: async ({ request, locals, params }) => {
		if (!AuthHelper.isAdmin(await locals.auth())) error(403, "Unauthorized");

		const serviceId = params.id;
		if (!serviceId) error(400, "Missing required fields");

		const formData = await request.formData();

		if (!formData.has("incidentId")) error(400, "Missing required fields");

		await prisma.incident.update({
			where: {
				id: formData.get("incidentId") as string
			},
			data: {
				endAt: new Date()
			}
		});

		throw redirect(302, `/service/${serviceId}`);
	}
};
