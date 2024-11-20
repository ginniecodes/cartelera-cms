"use client";
import { Avatar, Card, CardHeader } from "octagon-ui";
import React, { FC } from "react";
import styles from "./News.module.css";
import { ICourse } from "./ICourse";

export const NewsUpcomingCoursesBox: FC<{ courses: ICourse[] }> = ({ courses }) => {
	return (
		<Card className={styles.upcomingCourses} hover={false}>
			<CardHeader title="Proximos Cursos" />
			{courses.map(course => (
				<article key={course.id}>
					<header>
						<h4>{course.name}</h4>
						<p>
							{course.duration.startDate} - {course.duration.finishDate}
						</p>
					</header>
					<p>{course.abstract}</p>
					<footer>
						<Avatar
							size={24}
							src={course.instructor.avatar}
							alt={course.instructor.name}
						/>
						<p>{course.instructor.name}</p>
					</footer>
				</article>
			))}
		</Card>
	);
};
