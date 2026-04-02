import { useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProductStore } from "@/stores/useProductStore";
import PaginationBar from "@/components/PaginationBar";
import AddToCartButton from "@/components/AddToCartButton";

const LIMIT = 12; 


export function AllProductsPage() {
  const [searchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));

  const { products, pagination, isLoading, error, fetchAllProducts } =
    useProductStore();

  
  useEffect(() => {
    fetchAllProducts(page, LIMIT);
  }, [page]);

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-14 font-['Jost',sans-serif]">
      {/* Page header */}
      <div className="mb-10 space-y-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
          Catalogue
        </p>
        <h1
          className="text-[32px] font-light text-stone-900"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          All Products
        </h1>
      </div>

      <ProductGrid products={products} isLoading={isLoading} error={error} />

      {pagination && <PaginationBar pagination={pagination} />}
    </main>
  );
}


export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));

  const { products, pagination, isLoading, error, fetchProductsByCategory } =
    useProductStore();


  useEffect(() => {
    if (category) fetchProductsByCategory(category, page, LIMIT);
  }, [category, page]);

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-14 font-['Jost',sans-serif]">
      <div className="mb-10 space-y-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
          Category
        </p>
        <h1
          className="text-[32px] font-light text-stone-900 capitalize"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {category}
        </h1>
        {pagination && (
          <p className="text-stone-400 text-[12px] tracking-wide">
            {pagination.totalCount} items
          </p>
        )}
      </div>

      <ProductGrid products={products} isLoading={isLoading} error={error} />

      {pagination && <PaginationBar pagination={pagination} />}
    </main>
  );
}


function ProductGrid({
  products,
  isLoading,
  error,
}: {
  products: ReturnType<typeof useProductStore.getState>["products"];
  isLoading: boolean;
  error: string | null;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2
          size={20}
          strokeWidth={1.5}
          className="animate-spin text-stone-400"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-24">
        <p className="text-red-400 text-[12px] tracking-wide">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center py-24 gap-2">
        <p
          className="text-stone-300 text-2xl font-light"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          No products found.
        </p>
        <p className="text-stone-300 text-[11px] tracking-[0.15em] uppercase">
          Try a different category or check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
      {products.map((product) => (
        <div key={product._id} className="group space-y-3">
          {/* Image */}
          <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
            <Link to={`/products/${product._id}`}>
              <img
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80"
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </Link>
          </div>
          {/* Info */}
          <div className="space-y-1">
            <p className="text-[11px] tracking-[0.15em] uppercase text-stone-400">
              {product.category}
            </p>
            <h3
              className="text-[16px] font-light text-stone-900 leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {product.name}
            </h3>
            <p className="text-[13px] tracking-wide text-stone-600">
              ${product.price.toFixed(2)}
            </p>
            <AddToCartButton productId={product._id} variant="icon" />
          </div>
        </div>
      ))}
    </div>
  );
}
