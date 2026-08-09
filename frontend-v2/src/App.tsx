import { Router } from './router'
import { useRouter } from './routerContext'
import Home from './views/Home'
import About from './views/About'
import Privacy from './views/Privacy'
import ErrorView from './views/ErrorView'
import Footer from './components/Footer'

const Routes = () => {
  const { path } = useRouter()
  switch (path) {
    case '/':
      return <Home />
    case '/about':
      return <About />
    case '/privacy':
      return <Privacy />
    default:
      return <ErrorView errorCode={404} />
  }
}

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[lavender]">
        <div className="flex-1">
          <Routes />
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
