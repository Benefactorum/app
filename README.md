# Benefactorum

Benefactorum is a non-profit, collaborative donation platform that enables French donors to easily discover and support the causes they care about.
<br>
<br>

## Features

When Benefactorum is feature-complete, here's what you'll be able to do.

1. **Find Associations**: Discover organizations that align with your values.
2. **Make Donations**: Donate directly through Benefactorum.
3. **Stay in Control**: Manage your recurring donations and keep track of your tax benefits with ease.
<br>

## Tech Stack

### Backend
- **Ruby on Rails 8**: Provides a robust and maintainable backend foundation.
- **SQLite**: Lightweight and efficient database for streamlined deployment and development. Litestream replication.

### Frontend
- **React with TypeScript**: Ensures a dynamic and type-safe front-end experience.
- **Inertia.js**: Bridges the gap between Rails and React for fast single-page app functionality. Server Side Rendering (SSR).
- **TailwindCSS**: Provides a modern, responsive, and customizable UI.
- **shadcn/ui**: Reusable components for consistent design.

### Build & Deployment
- **Vite**: Efficient asset bundling and faster development builds.
- **Kamal**: Simplified deployment to Scaleway VPS.
- **GitHub Actions**: Manages CI/CD workflows for testing and deployment.
- **Dev Container**: Ready-to-use, containerized development environment.
<br>

## Installation & Setup

### Prerequisites
- Ensure you have [Visual Studio Code](https://code.visualstudio.com/) with Dev Containers extension or [Dev Container CLI](https://github.com/devcontainers/cli) installed.


### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Benefactorum/app benefactorum
   cd benefactorum
   ```
2. Set up the development container.

   **Example using Visual Studio Code**:
   ```bash
   code .
   ```
   Then click on the 'Reopen in Container' popup.

   *Note: You can achieve this setup with any Dev Containers-compatible tool.*

3. Start the development server:
   ```bash
   bin/dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
<br>

## Testing

Run tests to ensure stability:
```bash
bundle exec rspec # Backend & e2e tests
yarn test         # Frontend tests
```
<br>

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b branch-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message"
   ```
4. Push your branch and open a Pull Request.

Please follow the coding standards enforced by **Standard Ruby**, **Prettier**, and **ESLint**.
<br>
<br>

## License

This project is licensed under the [GNU GPLv3](./License) License.
<br>
<br>

## Contact

For any inquiries, feel free to reach out:
- Email: maximilien@benefactorum.org
- Manifesto: [benefactorum.org](https://benefactorum.org)
- Web app: https://staging.benefactorum.org (WIP)
