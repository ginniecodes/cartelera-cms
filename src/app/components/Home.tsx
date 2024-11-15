"use client";

import { Container } from "octagon-ui";

import { HomeGuidesBlock } from "./HomeGuidesBlock";
import { HomeHeadingBlock } from "./HomeHeadingBlock";
import { HomeScheduleBlock } from "./HomeScheduleBlock";
import { HomeWeekBlock } from "./HomeWeekBlock";

type HomeProps = {
	week: number;
	schedule: string | null;
};

export function Home({ week, schedule }: HomeProps) {
	return (
		<>
			<Container display>
				<HomeHeadingBlock />
				<HomeScheduleBlock schedule={schedule} />
				<HomeWeekBlock week={week} />
				<HomeGuidesBlock />
			</Container>
		</>
	);
}
