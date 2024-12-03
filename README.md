

## Getting Started



## Development Setup

To set up the Benefactorum project locally:

1. **Prerequisites**: Ensure you have [Visual Studio Code](https://code.visualstudio.com/) installed.
2. **Dev Container**: Open the project in VS Code; it will automatically set up the development container.
3. **Start Development**: Once the setup is complete, run the following command to start the development environment:

   ```bash
   bin/dev





---

# Benefactorum

Benefactorum is a non-profit, collaborative donation platform that enables French donors to easily discover and support the causes they care about. 

---

## Features

1. **Find Associations**: Discover organizations that align with your values.
2. **Make Donations**: Donate directly through Benefactorum.
3. **Tax Benefits**: Easily manage your tax deductions.

---

## Tech Stack

### Backend
- **Ruby on Rails 8**: Provides a robust and maintainable backend foundation.
- **SQLite**: Lightweight and efficient database for streamlined deployment and development.

### Frontend
- **React with TypeScript**: Ensures a dynamic and type-safe front-end experience.
- **Inertia.js**: Bridges the gap between Rails and React for fast single-page app functionality.
- **TailwindCSS**: Provides a modern, responsive, and customizable UI.
- **shadcn/ui**: Reusable components for consistent design.

### Build & Deployment
- **Vite**: Efficient asset bundling and faster development builds.
- **Kamal**: Simplified deployment to Scaleway VPS.
- **GitHub Actions**: Manages CI/CD workflows for testing and deployment.

---

## Installation & Setup

### Prerequisites
- Ensure you have [Visual Studio Code](https://code.visualstudio.com/) or [Dev Container CLI](https://github.com/devcontainers/cli) installed. 

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Benefactorum/app benefactorum
   cd benefactorum
   ```

2. Start the development server:
   ```bash
   bin/dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Testing

Run tests to ensure stability:
```bash
bundle exec rspec # Backend & e2e tests
yarn test         # Frontend tests
```

---

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push your branch and open a Pull Request.

Please follow the coding standards enforced by **Standard Ruby**, **Prettier**, and **ESLint**.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any inquiries, feel free to reach out:
- Email: maximilien@benefactorum.org
- Manifesto: [benefactorum.org](https://benefactorum.org)
- Web app: https://staging.benefactorum.org

--- 
