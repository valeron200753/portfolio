# TOKYO.DEV — Developer Portfolio

A modern, responsive developer portfolio built with React and TypeScript.

Created during a 30-day Full-Stack development marathon and continuously improved as my skills and projects grow.

## Overview

TOKYO.DEV is my personal website showcasing my technical skills, software projects, and development journey.

The portfolio is a standalone frontend application. Full-stack applications are maintained in separate repositories.

## Features

- Responsive Dark Forest design
- Light and dark themes
- Home, Projects, and Contact pages
- Project search and filtering
- Project status tracking: Planned, In Progress, Completed
- Individual project detail pages
- GitHub profile integration
- Contact form using an email draft
- Client-side navigation with React Router
- Automated project data tests

## Technology Stack

| Category | Technologies |
| --- | --- |
| Frontend | React, TypeScript |
| Build Tool | Vite |
| Routing | React Router |
| Styling | CSS3, CSS Variables, Responsive Design |
| Testing | Vitest |
| Development | Git, GitHub, Linux |

## Project Structure

```text
portfolio/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── test/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Getting Started

### Requirements

- Node.js 24 or newer
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/valeron200753/portfolio.git
cd portfolio/frontend
npm ci
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
npm run preview
```

### Testing and Linting

```bash
npm test
npm run lint
```

## Contact Configuration

The contact form supports an optional public email address.

Create `frontend/.env.local`:

```dotenv
VITE_CONTACT_EMAIL=your-public-email@example.com
```

Replace the example with your public contact email address.

The contact form uses `mailto:` to prepare an email draft. It does not send messages automatically.

All `VITE_` environment variables are exposed to the client and must not contain secrets.

## Featured Projects

### Task Manager

An independent Full-Stack application with authentication, personal task management, search, filters, and progress tracking.

**Stack:** React, TypeScript, Express, SQLite.

[Task Manager Repository](https://github.com/valeron200753/task-manager)

### Weather App

A planned weather application. Development has not started yet.

### Portfolio

This website itself — currently in active development.

## Learning Lab

Coding exercises and experiments from my learning journey are maintained separately.

[Learning Lab Repository](https://github.com/valeron200753/learning-lab)

## Deployment

The portfolio is designed for static hosting, without a dedicated backend server or database.

Public deployment through Cloudflare Pages is planned.

## Developer

**Tokyo — Full-Stack Developer**

[GitHub Profile](https://github.com/valeron200753)