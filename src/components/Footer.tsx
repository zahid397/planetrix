import { useState } from 'react';
import Logo from './Logo';
import InfoModal from './InfoModal';
import AboutContent from './footer-content/AboutContent';
import BlogContent from './footer-content/BlogContent';
import CareerContent from './footer-content/CareerContent';
import FaqContent from './footer-content/FaqContent';
import ContactContent from './footer-content/ContactContent';

type Key = 'about' | 'blog' | 'career' | 'faq' | 'contact';

const LINKS: { key: Key; label: string; title: string }[] = [
  { key: 'about', label: 'About Us', title: 'About Planetrix' },
  { key: 'blog', label: 'Blog', title: 'Planetrix Blog' },
  { key: 'career', label: 'Career', title: 'Join the Mission' },
  { key: 'faq', label: 'FAQ', title: 'Frequently Asked' },
  { key: 'contact', label: 'Contact us', title: 'Contact Mission Control' },
];

export default function Footer() {
  const [active, setActive] = useState<Key | null>(null);

  const renderContent = () => {
    switch (active) {
      case 'about': return <AboutContent />;
      case 'blog': return <BlogContent />;
      case 'career': return <CareerContent />;
      case 'faq': return <FaqContent />;
      case 'contact': return <ContactContent />;
      default: return null;
    }
  };

  const activeMeta = LINKS.find((l) => l.key === active);

  return (
    <>
      <footer
        className="relative z-30 w-full"
        style={{
          background: 'rgba(6, 11, 24, 0.95)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: 'clamp(8px, 1.6vw, 16px) clamp(14px, 4vw, 40px)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 max-w-7xl mx-auto">
          <div className="max-w-xs hidden md:block">
            <Logo size={16} />
            <p
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                marginTop: 12,
              }}
            >
              Lorem ipsum dolor sit amet consectetur. Fusce sed aliquam amet curabitur eget
              quam. Tortor nam volutpat tincidunt nibh lacus vitae sed mi. Viverra eu
              commodo sed sed commodo commodo urna sed.
            </p>
          </div>
          <nav
            className="flex md:flex-col md:items-end gap-x-4 gap-y-1 md:gap-y-2 flex-nowrap md:flex-wrap overflow-x-auto justify-center md:justify-end w-full"
            aria-label="Footer"
          >
            {LINKS.map((l) => (
              <button
                key={l.key}
                onClick={() => setActive(l.key)}
                className="footer-link footer-link-btn whitespace-nowrap"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </footer>

      <InfoModal
        open={active !== null}
        onClose={() => setActive(null)}
        title={activeMeta?.title ?? ''}
      >
        {renderContent()}
      </InfoModal>
    </>
  );
}
