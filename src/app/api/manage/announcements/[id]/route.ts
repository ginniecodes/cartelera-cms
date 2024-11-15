import { NextRequest, NextResponse } from "next/server";

import { AnnouncementFinder } from "../../../../../contexts/cma/announcements/application/find/AnnouncementFinder";
import { AnnouncementDoesNotExists } from "../../../../../contexts/cma/announcements/domain/AnnouncementDoesNotExists";
import { PostgresAnnouncementRepository } from "../../../../../contexts/cma/announcements/infrastructure/PostgresAnnouncementRepository";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<Response> {
	const { id } = await params;
	const postgresConnection = new PostgresConnection();
	let announcement = null;
	try {
		const announcementRepository = new PostgresAnnouncementRepository(postgresConnection);
		const announcementFinder = new AnnouncementFinder(announcementRepository);
		announcement = await announcementFinder.find(id);
	} catch (error) {
		if (error instanceof AnnouncementDoesNotExists) {
			return new Response(
				JSON.stringify({ code: "announcement_not_found", message: error.message }),
				{
					status: 404,
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
		}

		return new Response(
			JSON.stringify({ code: "unexpected_error", message: "Something happened" }),
			{
				status: 503,
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	}

	return NextResponse.json(announcement.toPrimitives());
}
