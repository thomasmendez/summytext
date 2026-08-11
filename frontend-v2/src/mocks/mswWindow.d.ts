import type { ScenarioName } from './scenarios'

// Helpers main.tsx attaches to window when mocks are enabled, so Playwright can
// switch the active predict scenario at runtime (e.g. window.__mswUse('serverError')).
declare global {
  interface Window {
    __mswUse?: (name: ScenarioName) => void
    __mswReset?: () => void
  }
}

export {}
