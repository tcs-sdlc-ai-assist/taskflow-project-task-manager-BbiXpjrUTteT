# TaskFlow

A lightweight, modern task management application built with Angular 17+ using standalone components, plain CSS, and localStorage for persistence. No external UI libraries — just clean, minimal code.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Organize tasks by status (To Do, In Progress, Done)
- **Priority Levels**: Assign priority levels (Low, Medium, High) to tasks
- **Search & Filter**: Quickly find tasks by title or filter by status/priority
- **Drag & Drop**: Reorder tasks across status columns using native HTML5 drag and drop
- **Persistent Storage**: All data saved to localStorage — no backend required
- **Responsive Design**: Fully responsive layout using CSS custom properties and media queries
- **Dark Mode**: Toggle between light and dark themes with CSS custom properties

## Tech Stack

| Technology | Purpose |
|---|---|
| **Angular 17+** | Frontend framework (standalone components, new control flow) |
| **TypeScript** | Type-safe development |
| **Plain CSS** | Styling with CSS custom properties (no Tailwind, Bootstrap, etc.) |
| **localStorage** | Client-side data persistence |
| **Vercel** | Deployment platform |

## Folder Structure

```
taskflow/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── task-board/
│   │   │   │   ├── task-board.component.ts
│   │   │   │   ├── task-board.component.html
│   │   │   │   └── task-board.component.css
│   │   │   ├── task-card/
│   │   │   │   ├── task-card.component.ts
│   │   │   │   ├── task-card.component.html
│   │   │   │   └── task-card.component.css
│   │   │   ├── task-form/
│   │   │   │   ├── task-form.component.ts
│   │   │   │   ├── task-form.component.html
│   │   │   │   └── task-form.component.css
│   │   │   ├── task-column/
│   │   │   │   ├── task-column.component.ts
│   │   │   │   ├── task-column.component.html
│   │   │   │   └── task-column.component.css
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.css
│   │   │   └── confirm-dialog/
│   │   │       ├── confirm-dialog.component.ts
│   │   │       ├── confirm-dialog.component.html
│   │   │       └── confirm-dialog.component.css
│   │   ├── models/
│   │   │   └── task.model.ts
│   │   ├── services/
│   │   │   ├── task.service.ts
│   │   │   └── theme.service.ts
│   │   ├── pipes/
│   │   │   └── filter-tasks.pipe.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vercel.json
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd taskflow

# Install dependencies
npm install
```

### Development Server

```bash
# Start the development server
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Build for Production

```bash
# Create a production build
ng build
```

Build artifacts are stored in the `dist/taskflow/browser/` directory.

### Running Tests

```bash
# Run unit tests
ng test
```

## Deployment (Vercel)

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from the project root
vercel
```

### Option 2: Git Integration

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Vercel auto-detects the Angular framework
4. Set the following build settings if not auto-detected:
   - **Build Command**: `ng build`
   - **Output Directory**: `dist/taskflow/browser`
   - **Install Command**: `npm install`

### Vercel Configuration

The project includes a `vercel.json` for proper SPA routing:

```json
{
  "buildCommand": "ng build",
  "outputDirectory": "dist/taskflow/browser",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## localStorage Schema

All application data is persisted in the browser's localStorage under the following keys:

### `taskflow_tasks`

Stores the array of all tasks.

```typescript
interface Task {
  id: string;            // UUID v4 generated via crypto.randomUUID()
  title: string;         // Task title (required, max 100 characters)
  description: string;   // Task description (optional, max 500 characters)
  status: TaskStatus;    // 'todo' | 'in-progress' | 'done'
  priority: TaskPriority; // 'low' | 'medium' | 'high'
  createdAt: string;     // ISO 8601 date string
  updatedAt: string;     // ISO 8601 date string
  order: number;         // Sort order within a status column
}
```

**Example:**

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Design landing page",
    "description": "Create wireframes and mockups for the new landing page",
    "status": "in-progress",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:22:00.000Z",
    "order": 0
  }
]
```

### `taskflow_theme`

Stores the user's theme preference.

```typescript
type Theme = 'light' | 'dark';
```

**Example:**

```json
"dark"
```

## Design Decisions

### Standalone Components

All components use Angular's `standalone: true` flag, eliminating the need for NgModules. This results in:
- Simpler component declarations with explicit dependency imports
- Better tree-shaking and smaller bundle sizes
- Easier lazy loading at the component level

### CSS Custom Properties (No External Libraries)

The project uses plain CSS with custom properties (CSS variables) for theming and consistent design tokens:

```css
:root {
  --color-primary: #6366f1;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text: #1e293b;
  --radius-md: 8px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  /* ... */
}

[data-theme='dark'] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  /* ... */
}
```

**Rationale**: No dependency on Tailwind, Bootstrap, Angular Material, or any CSS framework. This keeps the bundle size minimal, avoids version conflicts, and gives full control over the design system.

### No External Libraries

The entire application is built with Angular's built-in capabilities:
- **Forms**: Angular Reactive Forms (`FormGroup`, `FormControl`, `Validators`)
- **State Management**: RxJS `BehaviorSubject` in services (no NgRx, Akita, etc.)
- **Drag & Drop**: Native HTML5 Drag and Drop API (no `@angular/cdk/drag-drop`)
- **UUID Generation**: `crypto.randomUUID()` (no `uuid` package)
- **Storage**: Direct `localStorage` API (no wrapper libraries)

### New Angular Control Flow

Templates use Angular 17's built-in control flow syntax:

```html
@if (tasks.length > 0) {
  @for (task of tasks; track task.id) {
    <app-task-card [task]="task" />
  }
} @else {
  <p>No tasks yet. Create one to get started!</p>
}
```

## License

**Private** — All rights reserved. This project is not licensed for public use, distribution, or modification.