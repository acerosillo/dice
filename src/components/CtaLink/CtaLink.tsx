import './ctalink.scss';

export function CtaLink({ href, children }) {
  return (
    <a
      className="card-price__cta"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
