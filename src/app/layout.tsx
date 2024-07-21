import "./layout.css";

import type { Metadata } from "next";

import { lexend, literata } from "./fonts";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es-ES" className={[lexend.variable, literata.variable].join(" ")}>
			<body>{children}</body>
		</html>
	);
}
