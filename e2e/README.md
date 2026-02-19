# End-to-End Testing

This directory contains E2E tests for the motivational quotes application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see the browser)
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

## Test Structure

- `chat.spec.ts` - Tests for the Chat component functionality including:
  - UI element visibility
  - Preset prompt buttons
  - Input field interactions
  - Message sending and receiving
  - Save Quote functionality
  - Multiple message conversations

## Notes

- Tests automatically start the dev server before running
- API responses are mocked to avoid calling OpenAI during tests
- Tests run against `http://localhost:3000` by default
- Test reports are generated in the `playwright-report/` directory
