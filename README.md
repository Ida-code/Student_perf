# Student Performance Prediction System

A full-stack student performance tracking and prediction app with React frontend and PHP backend. This project includes quiz management, topic roadmaps, and results visualization.

## Project structure

- `src/` React frontend app
  - `App.jsx`, `Dashboard.jsx`, `QuestionsPage.jsx`, etc.
  - `components/` reusable components
- `api.js` API client for interacting with backend endpoints
- `db.php`, `getResults.php`, `submitResult.php`, etc. PHP backend endpoints
- `Stud_Perf/` mirrored backend files (student performance module)
- `public/`, `index.html` standard web assets
- `package.json` npm build scripts and dependencies

## Features

- User registration and login
- Quiz question fetching and answer submission
- Topic progress / roadmap tracking
- Result charts and basic analytics

## Local setup

1. Install Node dependencies:

   ```bash
   cd src
   npm install
   ```

2. Start frontend:

   ```bash
   npm start
   ```

3. Configure PHP backend (XAMPP or Docker) to serve project root.
4. Ensure API endpoints like `getQuestions.php`, `submitResult.php`, `getResults.php` are reachable by React.

## Notes (ML extension without DB changes)

- Current design stores predictions from existing quiz/result data.
- You can add a frontend module (e.g. `PredictionDashboard`) that reads `getResults` and runs local ML logic (rule-based or JS regression) without schema changes.

## Improvements

- Add dedicated ML service (Python/Flask) with model training on historic student metrics.
- Extend student attributes (attendance, study hours) to improve predictions.
- Add unit/integration tests (`jest` for React, PHPUnit for backend).

## Git

- Commit message style: `feat:`, `fix:`, `docs:`, `refactor:`
- Add this README now, then push:

```bash
git add README.md
git commit -m "docs: add project README"
git push
```
