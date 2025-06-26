# Obsidian-Vercel

An open-source tool for publishing Obsidian notes to the web using Next.js and [Vercel](https://vercel.com).

![image info](./public/preview.png)

Obsidian-Vercel is a toolkit for building a fast, searchable website from your Obsidian vault. It provides a straightforward way to publish notes online.

The project is designed for simplicity: place your Markdown files in the `content/` directory, and the project structure automatically turns them into web pages.

> [!NOTE]
> **A Note on Supporting Obsidian**
>
> This project provides a free, self-hosted way to publish your notes. However, it is not a replacement for the official Obsidian Sync service.
>
> If you find value in Obsidian, please consider supporting its development by purchasing an official plan. Their work makes tools like this one possible.

## Features

- **File-based Routing:** The file and folder structure of your content directory is automatically used to create the website's routes.
- **Selective Publishing:** Use the publish: true frontmatter flag in your notes to control which files are made public.
- **Full-Text Search:** Client-side fuzzy search allows for quickly finding content across all published notes.
- **Markdown & MDX Support:** Renders standard Markdown and supports MDX for more complex components.
- **Code & Math:** Includes syntax highlighting for code blocks and LaTeX support for mathematical equations.
- **Standard Technologies:** Built with Next.js, React, and Tailwind CSS for a customizable and modern web experience.
- **Light & Dark Mode:** A theme toggle is included by default.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fadriandlam%2Fobsidian-vercel&project-name=obsidian-vercel&repository-name=obsidian-vercel)

## Installation & Setup

To get your own version of the site running, follow these steps.

**1. Clone the Repository**

Clone this repository to your local machine.

````bash
git clone [https://github.com/adriandlam/obsidian-vercel.git](https://github.com/adriandlam/obsidian-vercel.git)
cd obsidian-vercel

**2. Install Dependencies**

This project uses `pnpm` as its package manager.

```bash
pnpm install
````

**3. Add Your Notes**

Delete the example notes inside the `content/` directory.

Copy your Obsidian vault (or any folder containing Markdown files) into the `content/` directory.

**4. Run Locally (Optional)**

To preview your site locally, run the development server:

```bash
pnpm dev
```

The site will be available at http://localhost:3000.

**5. Deploy to Vercel**

Push your cloned repository to your GitHub account and import it into Vercel. Vercel will automatically build and deploy your site. You can also use the one-click deploy button at the bottom of this README.

## Usage

### File Structure and Routing

The routing of your published site is determined by the structure of your `content/` directory.

- A file like `content/guides/my-first-note.md` will be available at `/guides/my-first-note`.
- A folder with an `index.md` file will serve as the route's landing page. For example, `content/projects/index.md` will be available at `/projects`.

This allows you to organize your content in a way that makes sense to you, either with flat file structures or nested folders.

### Frontmatter

To control the metadata and publishing status of your notes, use YAML frontmatter at the top of your Markdown files.

```yaml
---
title: "My Note Title"
excerpt: "A short summary of this note."
created: "2025-06-25"
updated: "2025-06-25"
publish: true
---
# Your note content starts here...
```

**Available Frontmatter Fields:**

| Field     | Type    | Description                                                                                                                               |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `publish` | boolean | **Required.** Set to `true` to make a note publicly accessible. Any other value (or its absence) will hide the note from the public site. |
| `title`   | string  | The title of the note. Used for display in the navigation, search results, and as the page `<title>`. Defaults to the filename if absent. |
| `excerpt` | string  | A short description used in search results and for SEO.                                                                                   |
| `created` | Date    | The creation date of the note. Displayed at the top of the page.                                                                          |
| `updated` | Date    | The last updated date. Displayed at the top of the page.                                                                                  |

### Search

The search functionality is powered by a pre-built search index.

- Press `/` to open the search dialog.
- The index is automatically generated at build time via `pnpm build:index`, which runs `scripts/generate-search-index.ts`. This script indexes the content of all notes with `publish: true`.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/adriandlam/obsidian-vercel/issues).

To contribute:

1. **Fork the Project.**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`).
4. **Run the linter and formatter** to ensure code quality:
   ```bash
   pnpm lint
   pnpm format
   ```
5. **Push to the Branch** (`git push origin feature/AmazingFeature`).
6. **Open a Pull Request.**

## Testing

This project does not yet have a formal test suite. To test the application, you can run it locally and manually verify its functionality.

```bash
pnpm dev
```

Contributions to add automated testing are welcome.

## Acknowledgements

This project builds upon several open-source technologies:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [MDX](https://mdxjs.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
``
