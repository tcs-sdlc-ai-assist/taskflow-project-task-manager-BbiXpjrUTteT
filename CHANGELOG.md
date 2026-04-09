# Changelog

All notable changes to the TaskFlow project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Dashboard** — Central overview displaying project summaries, task statistics, and recent activity at a glance.
- **Project Management (CRUD)** — Full create, read, update, and delete operations for projects including name, description, and status tracking.
- **Task Management (CRUD)** — Full create, read, update, and delete operations for tasks with support for title, description, priority, due date, and assignment to projects.
- **Kanban-Style Task Boards** — Drag-and-drop inspired task boards with columns for task statuses (To Do, In Progress, Done) enabling visual workflow management.
- **Task Filtering** — Filter tasks by status, priority, project, and due date to quickly locate relevant work items.
- **Analytics Dashboard** — Visual analytics with CSS-only bar charts, progress indicators, and summary statistics for project and task completion rates.
- **Responsive Navigation** — Adaptive navigation system featuring a sidebar on desktop/tablet viewports and a bottom navigation bar on mobile devices.
- **localStorage Persistence** — All project and task data is persisted to the browser's localStorage, ensuring data survives page refreshes and browser restarts without requiring a backend.
- **Dummy Data Seeding** — Pre-populated sample projects and tasks on first launch to demonstrate application functionality and provide an immediate interactive experience.
- **Vercel Deployment Configuration** — Production-ready deployment configuration for Vercel including build settings and routing rules for single-page application support.
- **Standalone Angular Components** — All components built as standalone using Angular 17+ conventions with modern control flow syntax (`@if`, `@for`).
- **Reactive Forms** — All form handling implemented with Angular Reactive Forms using proper validation.
- **RxJS Data Flows** — Services leverage RxJS `BehaviorSubject` and operators for reactive state management across components.

[1.0.0]: https://github.com/taskflow/taskflow/releases/tag/v1.0.0