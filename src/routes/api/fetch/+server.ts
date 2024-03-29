import { fetchItAll } from "$lib/fetcher";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {
	if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
		throw error(401, "Unauthorized");
	}

	fetchItAll();

	return new Response("OK");
};
