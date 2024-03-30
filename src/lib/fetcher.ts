import type { Service } from "@prisma/client";
import prisma from "./prsima";

async function fetchService(service: Service) {
	const fetchStart = process.hrtime();

	let res;
	try {
		res = await fetch(service.endpoint);
	} catch (ignore) {
		if (!(await hasUnresolvedIncident(service))) await createIncident(service);
	}

	const ping = process.hrtime(fetchStart)[1] / 1000000;

	if (!res?.ok) {
		if (!(await hasUnresolvedIncident(service))) await createIncident(service);
	}

	await prisma.record.create({
		data: {
			service: {
				connect: {
					id: service.id
				}
			},
			ping: Math.round(ping),
			status: res?.status || 500
		}
	});
}

async function cleanup(service: Service) {
	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);

	await prisma.record.deleteMany({
		where: {
			serviceId: service.id,
			createdAt: {
				lt: weekAgo
			}
		}
	});
}

async function createIncident(service: Service) {
	await prisma.incident.create({
		data: {
			service: {
				connect: {
					id: service.id
				}
			}
		}
	});
}

async function hasUnresolvedIncident(service: Service) {
	const incidents = await prisma.incident.findMany({
		where: {
			serviceId: service.id,
			endAt: null
		}
	});

	return incidents.length > 0;
}

export async function fetchItAll() {
	const services = await prisma.service.findMany();

	const fetchAndCleanupPromises = services.map((service) =>
		fetchService(service).then(() => cleanup(service))
	);

	await Promise.all(fetchAndCleanupPromises);
}
