import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	webServer: {
		command: "npm run build && npm run configure-rabbitmq && npm run start",
		url: "http://127.0.0.1:3000"
	},
	use: {
		baseURL: "http://127.0.0.1:3000",
		trace: "on-first-retry"
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	],
	retries: process.env.CI ? 2 : 0,
	reporter: "html"
});
