# **App Name**: TaskMaster Pro

## Core Features:

- Task Management: Create, update, view, and delete tasks with title, description, and creation timestamp.
- Filtering and Pagination: Filter tasks by title or description and paginate results for easy browsing (5 tasks per page).
- Audit Log: Track all task actions (create, update, delete) with timestamps, action types, task IDs, and updated content, facilitating monitoring, compliance and debugging.
- Basic Authentication: Implement static Basic Authentication with username 'admin' and password 'password123' to secure API endpoints.
- Input Validation and Sanitization: Validate user inputs on both the frontend and backend to prevent empty fields, enforce reasonable max lengths, and sanitize user-generated content.

## Style Guidelines:

- Primary color: Adaptable theme - Light mode: Soft Teal (#A7DBD8), Dark mode: Dark Teal (#395E5B) to maintain readability and reduce eye strain.
- Secondary color: Adaptable theme - Light mode: Light Gray (#EEEEEE), Dark mode: Dark Gray (#333333) to ensure clear contrast and comfortable viewing in both modes.
- Accent color: Adaptable theme - Light mode: Sky Blue (#87CEEB), Dark mode: Electric Blue (#7DF9FF) to draw attention to interactive elements and important notifications.  Color code action types: Create Task -> Green, Update Task -> Yellow, Delete Task -> Red.
- Body and headline font: 'Roboto', a grotesque-style sans-serif font for both headlines and body text. It offers a modern, machined, objective, neutral look that enhances readability and aligns with the application's functional design.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clear, simple icons for task actions (edit, delete) and navigation items. Each icon should be visually distinct to ensure ease of use.
- Implement a responsive layout with a left sidebar for navigation and a main area for the task table. Ensure the design is friendly for both desktop and tablet. Display “updatedContent” neatly as key–value pairs in the Audit Logs.
- Add subtle transitions and animations for task creation, updates, and deletions to enhance user experience. Animations should be smooth and quick to avoid slowing down the application.