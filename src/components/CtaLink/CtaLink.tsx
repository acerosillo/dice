import './ctalink.scss';
import type { CtaLinkProps } from './interface';

export const CtaLink: React.FC<CtaLinkProps> = ({ 
  href,
  children,
 }) => {
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
