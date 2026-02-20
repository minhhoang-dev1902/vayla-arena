import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import perfectionist from "eslint-plugin-perfectionist";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
	{
		plugins: {
			perfectionist,
		},
		rules: {
			// Sort object keys by line length
			"perfectionist/sort-objects": [
				"error",
				{
					order: "asc",
					type: "line-length",
				},
			],
			// Sort JSX props by line length (short → long)
			"perfectionist/sort-jsx-props": [
				"error",
				{
					order: "asc",
					type: "line-length",
				},
			],
			// Sort interface properties by line length
			"perfectionist/sort-interfaces": [
				"error",
				{
					order: "asc",
					type: "line-length",
				},
			],
			// Sort type properties by line length
			"perfectionist/sort-object-types": [
				"error",
				{
					order: "asc",
					type: "line-length",
				},
			],
		},
	},
]);

export default eslintConfig;
