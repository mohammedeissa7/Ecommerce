import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import AddToCartButton from "@/components/AddToCartButton";
import { cn } from "@/lib/utils";

const S = "'Cormorant Garamond', Georgia, serif";


const CATEGORIES = [
  {
    label: "Tops",
    slug: "tops",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
    count: "8 pieces",
  },
  {
    label: "Dresses",
    slug: "dresses",
    image:
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80",
    count: "8 pieces",
  },
  {
    label: "Outerwear",
    slug: "outerwear",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    count: "8 pieces",
  },
  {
    label: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    count: "8 pieces",
  },
];

const MARQUEE_WORDS = [
  "New Collection",
  "·",
  "Luxury Essentials",
  "·",
  "Made to Last",
  "·",
  "Free Shipping",
  "·",
  "Paris Inspired",
  "·",
  "Sustainable Craft",
  "·",
];

const EDITORIAL_ITEMS = [
  {
    tag: "Editorial",
    title: "The Art of Dressing Well",
    body: "Discover how simplicity becomes sophistication — a curation of essential pieces that transcend seasons.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80",
    link: "/products/category/dresses",
  },
  {
    tag: "Materials",
    title: "Crafted for Longevity",
    body: "We source only the finest natural fibres — linen, silk, cashmere — chosen for their beauty and endurance.",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=80",
    link: "/products",
  },
];

// ─── Fade-in hook ──────────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Section wrapper with reveal ──────────────────────────────────────────────
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Featured product card ────────────────────────────────────────────────────
function FeaturedCard({ product, index }: { product: any; index: number }) {
  return (
    <Reveal delay={index * 80}>
      <div className="group space-y-3">
        <Link
          to={`/products/${product._id}`}
          className="block relative overflow-hidden bg-stone-100 aspect-[3/4]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {/* Quick add */}
          <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <AddToCartButton productId={product._id} />
          </div>
          {/* Featured badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[9px] tracking-[0.2em] uppercase text-stone-600 px-2.5 py-1">
              Featured
            </span>
          </div>
        </Link>
        <div className="space-y-0.5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
            {product.category}
          </p>
          <Link to={`/products/${product._id}`}>
            <h3
              className="text-[16px] font-light text-stone-900 leading-snug hover:text-stone-500 transition-colors"
              style={{ fontFamily: S }}
            >
              {product.name}
            </h3>
          </Link>
          <p className="text-[13px] tracking-wide text-stone-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Reveal>
  );
}


export default function HomePage() {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="font-['Jost',sans-serif] overflow-hidden">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end bg-stone-900 overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=85"
          alt="Maison Paris hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            transform: heroLoaded ? "scale(1)" : "scale(1.06)",
            transition: "transform 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/20 to-transparent" />

        {/* Vertical text — desktop */}
        <div
          className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-3"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transition: "opacity 1s ease 1.2s",
          }}
        >
          <div className="w-px h-16 bg-white/20" />
          <p
            className="text-white/30 text-[9px] tracking-[0.4em] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Scroll to Explore
          </p>
          <div className="w-px h-16 bg-white/20" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-16 lg:pb-20">
          <div className="max-w-2xl space-y-6">
            <div
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "none" : "translateY(20px)",
                transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
              }}
            >
              <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase">
                SS 2025 Collection
              </span>
            </div>

            <h1
              className="text-[clamp(48px,7vw,96px)] font-light text-white leading-[0.95] tracking-tight"
              style={{
                fontFamily: S,
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "none" : "translateY(30px)",
                transition: "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s",
              }}
            >
              Dressed in
              <br />
              <em className="not-italic text-stone-300">Silence.</em>
            </h1>

            <p
              className="text-white/50 text-[13px] tracking-wide leading-relaxed max-w-sm"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "none" : "translateY(20px)",
                transition: "opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s",
              }}
            >
              A new language of luxury — refined essentials crafted for those
              who find beauty in restraint.
            </p>

            <div
              className="flex items-center gap-5 pt-2"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "none" : "translateY(20px)",
                transition: "opacity 0.9s ease 0.9s, transform 0.9s ease 0.9s",
              }}
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-white text-stone-900 text-[11px] tracking-[0.3em] uppercase px-7 h-12 hover:bg-stone-100 transition-colors duration-200 group"
              >
                Shop Collection
                <ArrowRight
                  size={13}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/products/category/dresses"
                className="text-white/50 text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors duration-200 underline underline-offset-4"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transition: "opacity 1s ease 1.4s",
          }}
        >
          <div className="w-px h-10 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-stone-900 py-3 overflow-hidden border-t border-white/5">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span
              key={i}
              className={cn(
                "text-[11px] tracking-[0.3em] uppercase flex-shrink-0",
                word === "·" ? "text-white/20" : "text-white/40",
              )}
            >
              {word}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <Reveal className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
              Browse
            </p>
            <h2
              className="text-[28px] lg:text-[34px] font-light text-stone-900"
              style={{ fontFamily: S }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors group"
          >
            All Products
            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 70}>
              <Link
                to={`/products/category/${cat.slug}`}
                className="group relative overflow-hidden bg-stone-100 aspect-[3/4] block"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase mb-1">
                      {cat.count}
                    </p>
                    <h3
                      className="text-white text-[20px] font-light leading-none"
                      style={{ fontFamily: S }}
                    >
                      {cat.label}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.5}
                      className="text-white"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="bg-stone-50 py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal className="flex items-end justify-between mb-10">
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                  Curated
                </p>
                <h2
                  className="text-[28px] lg:text-[34px] font-light text-stone-900"
                  style={{ fontFamily: S }}
                >
                  Featured Pieces
                </h2>
              </div>
              <Link
                to="/products"
                className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors group"
              >
                View All
                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {featuredProducts.slice(0, 8).map((product, i) => (
                <FeaturedCard key={product._id} product={product} index={i} />
              ))}
            </div>

            <Reveal className="mt-12 text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 border border-stone-900 text-stone-900 text-[11px] tracking-[0.3em] uppercase px-8 h-12 hover:bg-stone-900 hover:text-white transition-colors duration-300 group"
              >
                Shop All Pieces
                <ArrowRight
                  size={13}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          EDITORIAL — SPLIT PANELS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="space-y-24">
          {EDITORIAL_ITEMS.map((item, i) => (
            <Reveal key={item.title}>
              <div
                className={cn(
                  "grid lg:grid-cols-2 gap-10 lg:gap-20 items-center",
                  i % 2 === 1 && "lg:[direction:rtl]",
                )}
              >
                {/* Image */}
                <div
                  className={cn(
                    "overflow-hidden bg-stone-100 aspect-[4/5]",
                    i % 2 === 1 && "[direction:ltr]",
                  )}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                {/* Text */}
                <div
                  className={cn("space-y-6", i % 2 === 1 && "[direction:ltr]")}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                      {item.tag}
                    </span>
                    <h2
                      className="text-[32px] lg:text-[42px] font-light text-stone-900 leading-tight"
                      style={{ fontFamily: S }}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-[13px] leading-[1.9] tracking-wide text-stone-500 max-w-sm">
                    {item.body}
                  </p>
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-400 transition-colors duration-200 group"
                  >
                    Explore
                    <ArrowRight
                      size={12}
                      strokeWidth={1.5}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          BRAND BANNER — full-bleed dark
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-stone-900 py-24 lg:py-32">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="brand"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
          <Reveal>
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase">
              Our Philosophy
            </p>
            <h2
              className="text-[clamp(32px,5vw,64px)] font-light text-white leading-tight mt-3"
              style={{ fontFamily: S }}
            >
              "Less, but better."
            </h2>
            <p className="text-white/40 text-[13px] tracking-wide leading-relaxed max-w-md mx-auto mt-4">
              Every Maison piece is designed to outlast seasons — chosen slowly,
              worn for years, cherished forever.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 mt-8 border border-white/30 text-white text-[11px] tracking-[0.3em] uppercase px-8 h-12 hover:bg-white hover:text-stone-900 transition-colors duration-300 group"
            >
              Discover the Collection
              <ArrowRight
                size={13}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          BOTTOM MARQUEE — light
      ════════════════════════════════════════════════════════════════════ */}
      <div className="py-10 border-t border-stone-100 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: "marquee2 35s linear infinite" }}
        >
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span
              key={i}
              className={cn(
                "text-[11px] tracking-[0.3em] uppercase flex-shrink-0",
                word === "·" ? "text-stone-200" : "text-stone-300",
              )}
            >
              {word}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee2 {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </main>
  );
}
