# chumba-casino-playwright-automation

Playwright automation suite for **Chumba Casino** built with **TypeScript**, covering authentication, game lobby, navigation, and responsible gaming — designed to run in CI without exposing real credentials using mock HTML stubs.

![CI](https://github.com/Djones-qa/chumba-casino-playwright-automation/actions/workflows/playwright.yml/badge.svg)
![Language](https://img.shields.io/badge/language-TypeScript-blue)
![Framework](https://img.shields.io/badge/framework-Playwright-45ba4b)
![Target](https://img.shields.io/badge/target-Chumba%20Casino-purple)

---

## Overview

This project demonstrates how to automate a real-world production web app that requires authentication. The `LoginPage` uses Playwright's `page.route()` to intercept network requests and serve mock HTML pages, allowing the full test suite to run in GitHub Actions CI without real credentials while still validating UI structure, navigation flows, and responsible gaming compliance elements.

---

## Test Coverage

| Spec | Tests | What It Covers |
|------|-------|----------------|
| auth.spec.ts | 6 | Page load, form fields, invalid login error, forgot password, social login, successful login |
| lobby.spec.ts | 5 | Game grid visibility, Gold Coins balance, Sweeps Coins balance, search, categories |
| navigation.spec.ts | 5 | Store, redeem, profile menu, promotions, support access |
| responsible.spec.ts | 4 | Responsible gaming link, terms, privacy policy, age verification notice |
| **Total** | **20** | **4 spec files across auth, lobby, navigation, and compliance** |

---

## Project Structure
```
chumba-casino-playwright-automation/
├── .github/
│   └── workflows/           # GitHub Actions CI pipeline
├── pages/                   # Page Object Model classes
│   ├── BasePage.ts          # Shared load and navigation helpers
│   ├── LoginPage.ts         # Login interactions + mock HTML stub builder
│   └── LobbyPage.ts        # Lobby interactions and balance checks
├── tests/
│   ├── auth.spec.ts         # Authentication test scenarios
│   ├── lobby.spec.ts        # Game lobby tests
│   ├── navigation.spec.ts   # Site navigation tests
│   └── responsible.spec.ts  # Responsible gaming compliance tests
├── .env                     # Local credentials (gitignored)
├── playwright.config.ts     # Playwright configuration with dotenv
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher

### Installation
```bash
git clone https://github.com/Djones-qa/chumba-casino-playwright-automation.git
cd chumba-casino-playwright-automation
npm install
npx playwright install chromium
```

### Environment Variables

Create a `.env` file in the root (already gitignored):
```
CHUMBA_EMAIL=your-email@example.com
CHUMBA_PASSWORD=your-password
```

Without these, the auth smoke test that exercises real login will skip gracefully — all other tests run using the mock HTML stub.

### Running Tests
```bash
# Run all tests
npx playwright test

# Run smoke tests only
npx playwright test --grep @smoke

# Run by tag
npx playwright test --grep @auth
npx playwright test --grep @lobby
npx playwright test --grep @navigation
npx playwright test --grep @responsible

# View HTML report
npx playwright show-report
```

---

## How the Mock Strategy Works

Testing against a real production app that requires login presents a CI challenge — you cannot commit real credentials to a public repo. This suite solves it with Playwright's `page.route()` API inside `LoginPage`:

1. **All network requests are intercepted** before any real HTTP traffic leaves the browser
2. Requests to the login URL are fulfilled with a locally built HTML page that matches the real app's element structure
3. On valid credential submission the mock redirects to a lobby HTML stub containing the exact CSS class patterns the tests assert against
4. On invalid credentials the mock surfaces an inline error element, satisfying the error-state assertions

This means **20 tests run fully in CI with zero real network calls and zero exposed credentials**, while still exercising real Playwright interactions against realistic DOM structures.

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. The pipeline installs dependencies, installs Chromium, and runs the full suite — no secrets required for the mock-based tests.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation and test runner |
| TypeScript | Type-safe page objects and tests |
| dotenv | Secure local credential loading |
| page.route() | Network interception for CI-safe mocking |
| GitHub Actions | CI/CD pipeline |

---

## Author

**Darrius Jones** — QA Automation Engineer
[GitHub](https://github.com/Djones-qa) · [LinkedIn](https://linkedin.com/in/darrius-jones-28226b350)
