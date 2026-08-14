import { Link } from '../router'

const navLinks = [
  { to: '/privacy', label: 'Privacy', testId: 'nav-link-privacy' },
  { to: '/', label: 'Home', testId: 'nav-link-home' },
  { to: '/about', label: 'About', testId: 'nav-link-about' },
]

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t border-gray-400 bg-lavender py-10 text-center"
    >
      <div className="flex">
        {navLinks.map(({ to, label, testId }) => (
          <div key={testId} className="flex-1">
            <Link
              to={to}
              className="text-blue-700 hover:underline"
              data-testid={testId}
            >
              {label}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-4 text-gray-700">© {new Date().getFullYear()} Copyright</p>
    </footer>
  )
}

export default Footer
