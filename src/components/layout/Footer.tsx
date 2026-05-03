export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-muted border-t border-surface-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div>
            <h3 className="font-display font-bold text-lg text-brand-600 mb-2">SkillBridge</h3>
            <p className="text-ink-muted text-sm">Connecting learners with expert tutors worldwide.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-ink mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><a href="#browse" className="hover:text-ink">Browse</a></li>
              <li><a href="#categories" className="hover:text-ink">Categories</a></li>
              <li><a href="#how-it-works" className="hover:text-ink">How It Works</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-ink mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><a href="#about" className="hover:text-ink">About</a></li>
              <li><a href="#contact" className="hover:text-ink">Contact</a></li>
              <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-ink mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li><a href="#terms" className="hover:text-ink">Terms</a></li>
              <li><a href="#privacy" className="hover:text-ink">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-ink-muted text-sm">
            © {currentYear} SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
