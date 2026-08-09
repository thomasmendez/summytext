import { Link } from '../router'

type FooterProps = {
  pt?: number
  pb?: number
}

const Footer = ({ pt = 5, pb = 5 }: FooterProps) => {
  return (
    <footer
      className="border-t border-gray-400 bg-[lavender] text-center"
      style={{ paddingTop: pt * 8, paddingBottom: pb * 8 }}
    >
      <div className="flex">
        <div className="flex-1">
          <Link to="/privacy" className="text-blue-700 hover:underline">
            Privacy
          </Link>
        </div>
        <div className="flex-1">
          <Link to="/" className="text-blue-700 hover:underline">
            Home
          </Link>
        </div>
        <div className="flex-1">
          <Link to="/about" className="text-blue-700 hover:underline">
            About
          </Link>
        </div>
      </div>
      <p className="mt-4 text-gray-700">© {new Date().getFullYear()} Copyright</p>
    </footer>
  )
}

export default Footer
