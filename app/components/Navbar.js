export default function Navbar() {
  return (
    <nav>
      <a href="#" className="nav-logo">
        business-ASAP<span>.</span>
      </a>
      <ul className="nav-links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#wizard">Validate idea</a></li>
        <li><a href="#pricing">Our Deal</a></li>
        <li><a href="#roadmap">Roadmap</a></li>
        <li><a href="#cta" className="nav-cta">Get started</a></li>
      </ul>
    </nav>
  );
}
