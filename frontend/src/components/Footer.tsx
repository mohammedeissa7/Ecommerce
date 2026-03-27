
import { Link } from "react-router-dom"

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", to: "/new-arrivals" },
      { label: "Collections", to: "/collections" },
      { label: "Sale", to: "/sale" },
      { label: "Gift Cards", to: "/gift-cards" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Sustainability", to: "/sustainability" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Shipping & Returns", to: "/shipping" },
      { label: "Size Guide", to: "/size-guide" },
      { label: "FAQ", to: "/faq" },
    ],
  },
];




export default function Footer() {

  return (
    <footer
      className="bg-stone-900 text-white font-['Jost',sans-serif]"
      aria-label="Site footer"
    >

      {/*  Main links grid  */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div>
              <Link to="/">
                <span
                  className="text-white text-xl tracking-[0.4em] uppercase font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Eissa
                </span>
                
              </Link>
            </div>

            <p className="text-white/35 text-[12px] tracking-wide leading-relaxed max-w-[260px]">
              Refined essentials crafted for those who find beauty in
              simplicity. Designed in Paris, made for the world.
            </p>

            
          </div>

          {/* Nav columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="space-y-5">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/35 font-medium">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[12px] tracking-[0.05em] text-white/45 hover:text-white transition-colors duration-200 relative group w-fit block"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/40 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ────────────────────────────────────────────────────────── */}
        <div className="h-px bg-white/[0.06] my-12" />

        {/* ── Large brand watermark ───────────────────────────────────────────── */}
        <div className="mt-25 overflow-hidden select-none pointer-events-none">
          <p
            className="text-[clamp(92px,10vw,180px)] font-semibold tracking-[0.15em] uppercase text-white/[0.03] leading-none"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            aria-hidden="true"
          >
            Eissa
          </p>
        </div>
      </div>
    </footer>
  );
}
