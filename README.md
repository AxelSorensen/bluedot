# 🔵 BlueDot Learn

Prototypes built in collaboration with BlueDot to improve the learning efficiency of their platform.

## Features

- 🎯 **Objectives page** — presents learning objectives to the user
- ❓ **Question flow** — `questions.vue` and `play.vue` drive an interactive Q&A / exercise flow
- 🤖 **AI-assisted content** — uses the `openai` SDK, with `cheerio` for scraping/parsing source content
- 🎨 **Icon-driven UI** — Heroicons via `unplugin-icons`

## Installation

```bash
git clone <this repo>
cd bluedot
npm install
```

## Usage

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build      # production build
npm run generate   # static generation
npm run preview    # preview production build
```

## Built with

- [Nuxt 3](https://nuxt.com/)
- [OpenAI API](https://platform.openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cheerio](https://cheerio.js.org/)

## Status

🚧 Prototype for an external collaborator (BlueDot) — a `mess/` directory in the repo suggests experimental/scratch content alongside the working pages.
