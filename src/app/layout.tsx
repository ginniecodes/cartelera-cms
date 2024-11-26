import "octagon-ui/dist/index.css";
import "./rootLayout.css";

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es-ES">
			{process.env.NODE_ENV === "production" && <Analytics />}
			<body>{children}</body>
		</html>
	);
}
