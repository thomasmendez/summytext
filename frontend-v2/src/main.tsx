import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from './store'

// Start the MSW worker only when explicitly enabled (dev demos + Playwright).
// It never runs in a normal production build.
async function enableMocking() {
  if (import.meta.env.VITE_MOCKS_ENABLED !== 'true') return

  const { worker } = await import('./mocks/browser')
  const { scenarioHandlers } = await import('./mocks/scenarios')

  await worker.start({ onUnhandledRequest: 'bypass' })

  // Let Playwright swap the active predict scenario at runtime.
  window.__mswUse = (name) => worker.use(scenarioHandlers[name])
  window.__mswReset = () => worker.resetHandlers()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
})
