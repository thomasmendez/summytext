import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// The browser-side worker used in dev and by Playwright. Shares the same
// `handlers` array as any Node setup so a handler is written once.
export const worker = setupWorker(...handlers)
