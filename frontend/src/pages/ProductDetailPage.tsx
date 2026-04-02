import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Truck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import axiosInstance from "@/lib/axios";
import AddToCartButton from "@/components/AddToCartButton";
import { cn } from "@/lib/utils";
import type { Product } from "@/stores/useProductStore";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";


const FONT_SERIF = "'Cormorant Garamond', Georgia, serif";

// Accordion row
function AccordionRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-stone-100">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-[11px] tracking-[0.25em] uppercase text-stone-600 font-medium group-hover:text-stone-900 transition-colors">
          {label}
        </span>
        {open ? (
          <ChevronUp size={14} strokeWidth={1.5} className="text-stone-400" />
        ) : (
          <ChevronDown size={14} strokeWidth={1.5} className="text-stone-400" />
        )}
      </button>
      {open && (
        <div className="pb-4 text-[13px] leading-relaxed tracking-wide text-stone-500">
          {children}
        </div>
      )}
    </div>
  );
}

// Recommended product card 
function RecommendedCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product._id}`} className="group block space-y-3">
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
          <AddToCartButton productId={product._id} />
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400">
          {product.category}
        </p>
        <h3
          className="text-[16px] font-light text-stone-900 leading-snug group-hover:text-stone-600 transition-colors"
          style={{ fontFamily: FONT_SERIF }}
        >
          {product.name}
        </h3>
        <p className="text-[13px] tracking-wide text-stone-600">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

// Main page
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { recommendedProducts, fetchRecommendedProducts } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setSelectedImage(0);

    axiosInstance
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? "Product not found.");
        setIsLoading(false);
      });
  }, [id]);


  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

 
  if (isLoading) return <ProductDetailSkeleton />;
  
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6 font-['Jost',sans-serif]">
        <p
          className="text-[28px] font-light text-stone-400"
          style={{ fontFamily: FONT_SERIF }}
        >
          Product not found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-[11px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Go Back
        </button>
      </div>
    );
  }

  const gallery = [product.image, product.image, product.image];

  return (
    <main className="font-['Jost',sans-serif]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-stone-400">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-stone-900 transition-colors"
          >
            Collections
          </Link>
          <span>/</span>
          <Link
            to={`/products/category/${product.category}`}
            className="hover:text-stone-900 transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-700 truncate max-w-[160px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product grid  */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Image column */}
          <div className="flex gap-4">
            {/* Thumbnail strip */}
            <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-16 h-20 overflow-hidden bg-stone-100 transition-all duration-200",
                    selectedImage === i
                      ? "ring-1 ring-stone-900 ring-offset-1"
                      : "opacity-50 hover:opacity-100",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative overflow-hidden bg-stone-100 aspect-[3/4] group">
              <img
                src={gallery[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-[9px] tracking-[0.25em] uppercase text-stone-600 px-3 py-1.5">
                  {product.category}
                </span>
              </div>
              {/* Featured badge */}
              {product.isFeatured && (
                <div className="absolute top-4 right-4">
                  <span className="bg-stone-900 text-[9px] tracking-[0.25em] uppercase text-white px-3 py-1.5">
                    Featured
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info column */}
          <div className="lg:pt-4 space-y-8">
            {/* Title & price */}
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                Eissa
              </p>
              <h1
                className="text-[32px] lg:text-[40px] font-light text-stone-900 leading-tight"
                style={{ fontFamily: FONT_SERIF }}
              >
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <p className="text-[22px] tracking-wide text-stone-900">
                  ${product.price.toFixed(2)}
                </p>
                <span className="text-[10px] tracking-[0.15em] uppercase text-stone-400">
                  USD
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-stone-100" />

            {/* Description */}
            <p className="text-[13px] leading-[1.8] tracking-wide text-stone-500">
              {product.description}
            </p>

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <AddToCartButton productId={product._id} />
              <p className="text-center text-[10px] tracking-[0.15em] uppercase text-stone-300">
                Free returns within 30 days
              </p>
            </div>

            {/* Trust strips */}
            <div className="grid grid-cols-3 gap-4 py-2">
              {[
                {
                  icon: Truck,
                  label: "Free Shipping",
                  sub: "Orders over $250",
                },
                {
                  icon: RefreshCw,
                  label: "Free Returns",
                  sub: "Within 30 days",
                },
                {
                  icon: ShieldCheck,
                  label: "Secure Pay",
                  sub: "SSL encrypted",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5"
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className="text-stone-400"
                  />
                  <span className="text-[10px] tracking-[0.1em] uppercase text-stone-600 leading-tight">
                    {label}
                  </span>
                  <span className="text-[9px] tracking-wide text-stone-300">
                    {sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-stone-100" />

            {/* Accordion details */}
            <div>
              <AccordionRow label="Product Details">
                <ul className="space-y-1.5 list-none">
                  <li>
                    • Category:{" "}
                    <span className="capitalize">{product.category}</span>
                  </li>
                  <li>• Ref: {product._id.slice(-8).toUpperCase()}</li>
                  <li>• Sustainably crafted in limited quantities</li>
                  <li>• Model is 178 cm and wears a size S</li>
                </ul>
              </AccordionRow>

              <AccordionRow label="Materials & Care">
                <ul className="space-y-1.5">
                  <li>• Natural fibres where possible</li>
                  <li>• Hand wash cold or dry clean only</li>
                  <li>• Do not tumble dry</li>
                  <li>• Store folded in a cool, dry place</li>
                </ul>
              </AccordionRow>

              <AccordionRow label="Shipping & Returns">
                <p>
                  Orders over $250 ship free. Standard delivery 3–5 business
                  days. Express available at checkout. Returns accepted within
                  30 days of receipt — items must be unworn and in original
                  packaging.
                </p>
              </AccordionRow>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended products */}
      {recommendedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-stone-100">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
                You May Also Like
              </p>
              <h2
                className="text-[26px] font-light text-stone-900"
                style={{ fontFamily: FONT_SERIF }}
              >
                Recommended
              </h2>
            </div>
            <Link
              to="/products"
              className="text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors underline underline-offset-4 hidden sm:block"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
            {recommendedProducts.map((rec) => (
              <RecommendedCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
