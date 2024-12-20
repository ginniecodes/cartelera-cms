import { NextRequest, NextResponse } from "next/server";

import { CoursesByCriteriaSearcher } from "../../../../contexts/cma/courses/application/search-by-criteria/CoursesByCriteriaSearcher";
import { PostgresCourseRepository } from "../../../../contexts/cma/courses/infrastructure/PostgresCourseRepository";
import { SearchParamsCriteriaFiltersParser } from "../../../../contexts/shared/infrastructure/criteria/SearchParamsCriteriaFiltersParser";
import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";

const searcher = new CoursesByCriteriaSearcher(
	new PostgresCourseRepository(new PostgresConnection())
);

export async function GET(request: NextRequest): Promise<Response> {
	const { searchParams } = new URL(request.url);

	const filters = SearchParamsCriteriaFiltersParser.parse(searchParams);
	const courses = await searcher.search(
		filters,
		searchParams.get("orderBy"),
		searchParams.get("orderType"),
		searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize") as string, 10) : null,
		searchParams.get("pageNumber")
			? parseInt(searchParams.get("pageNumber") as string, 10)
			: null
	);

	return NextResponse.json(courses.map(course => course.toPrimitives()));
}
