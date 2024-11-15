import { NextRequest, NextResponse } from "next/server";

import { AnnouncementsByCriteriaSearcher } from "../../../../contexts/cma/announcements/application/search_by_criteria/AnnouncementsByCriteriaSearcher";
import { PostgresAnnouncementRepository } from "../../../../contexts/cma/announcements/infrastructure/PostgresAnnouncementRepository";
import { SearchParamsCriteriaFiltersParser } from "../../../../contexts/shared/infrastructure/criteria/SearchParamsCriteriaFiltersParser";
import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";

const searcher = new AnnouncementsByCriteriaSearcher(
	new PostgresAnnouncementRepository(new PostgresConnection())
);

export async function GET(request: NextRequest): Promise<Response> {
	const { searchParams } = new URL(request.url);

	const filters = SearchParamsCriteriaFiltersParser.parse(searchParams);
	const announcements = await searcher.search(
		filters,
		searchParams.get("orderBy"),
		searchParams.get("orderType"),
		searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize") as string, 10) : null,
		searchParams.get("pageNumber")
			? parseInt(searchParams.get("pageNumber") as string, 10)
			: null
	);

	return NextResponse.json(announcements.map(announcement => announcement.toPrimitives()));
}
