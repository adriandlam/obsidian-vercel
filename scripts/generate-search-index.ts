import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPublishedNotesData } from "../lib/content";
import ora from "ora";
import chalk from "chalk";

// Helper to get project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Define output path relative to project root
const outputDir = path.join(projectRoot, "public");
const outputPath = path.join(outputDir, "search-index.json");

async function generateIndex() {
	const startTime = Date.now();
	const spinner = ora(
		`Generating search index for ${chalk.gray(path.relative(projectRoot, "content"))}...`,
	).start();
	console.log("");

	try {
		const notes = await getAllPublishedNotesData();
		const indexedSlugs = notes.map((note) => note.slug.join("/"));
		console.log(`\n Indexed Notes: ${chalk.green(`+${indexedSlugs.length}`)}`);
		indexedSlugs.forEach((slug, i) => {
			console.log(` ${chalk.green("+")} ${slug}`);
		});
		console.log("");

		spinner.text = "Ensuring output directory...";
		await fs.mkdir(outputDir, { recursive: true });

		spinner.text = "Writing search index...";
		await fs.writeFile(outputPath, JSON.stringify(notes), "utf8");

		spinner.succeed(chalk.green("Search index generated successfully."));
		const endTime = Date.now();
		const elapsed = endTime - startTime;
		const formattedTime =
			elapsed < 1000 ? `${elapsed}ms` : `${(elapsed / 1000).toFixed(2)}s`;

		console.log(chalk.gray(path.relative(projectRoot, outputPath)));
		console.log("");
		console.log(`Done in ${formattedTime}`);
		process.exit(0);
	} catch (error) {
		spinner.fail(chalk.red("Failed to generate search index."));
		console.error(chalk.red("Error:"), error);
		process.exit(1);
	}
}

generateIndex();
