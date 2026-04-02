import { useState, useEffect } from "react";
import { ShoppingBag, User, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";

const NAV_LINKS = [
  { label: "Collections", href: "/products" },
  { label: "New Arrivals", href: "#" },
  { label: "Sale", href: "#" },
  { label: "About", href: "#" },
];



export default function Navbar() {
  const { totalItems, openDrawer, fetchCart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  
  
  
  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);


  return (
    <>
      {/* Announcement bar */}
      <div className="w-full bg-stone-900 text-stone-200 text-center py-2 text-[11px] tracking-[0.2em] uppercase font-light">
        Complimentary shipping on orders over $250
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.08)]"
            : "bg-white",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — Nav links (desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[11px] tracking-[0.15em] uppercase text-stone-500 hover:text-stone-900 transition-colors duration-200 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Center — Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none select-none"
            >
              <span
                className="text-[22px] lg:text-[26px] font-semibold tracking-[0.3em] text-stone-900 uppercase"
                style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
              >
                <Link to={"/"}>Eissa</Link>
              </span>
            </Link>

            {/* Right — Actions */}
            <div className="flex items-center gap-1 lg:gap-2 ml-auto lg:ml-0">
              {/* Auth dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button

                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-full"
                    aria-label="Account"
                  >
                    <User size={18} strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-none border-stone-200 shadow-lg mt-2"
                >
                  <div className="px-3 py-2">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-medium">
                      My Account
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-stone-100" />
                  {user ? (
                    <>
                      <Link to="/profile">
                        <DropdownMenuItem className="text-[12px] tracking-wide text-stone-600 hover:text-stone-900 cursor-pointer py-2.5">
                          my profile
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/" onClick={() => { signOut(); }}>
                        <DropdownMenuItem className="text-[12px] tracking-wide text-stone-600 hover:text-stone-900 cursor-pointer py-2.5">
                          signout
                        </DropdownMenuItem>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/signin">
                        <DropdownMenuItem className="text-[12px] tracking-wide text-stone-600 hover:text-stone-900 cursor-pointer py-2.5">
                          Sign In
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/signup">
                        <DropdownMenuItem className="text-[12px] tracking-wide text-stone-600 hover:text-stone-900 cursor-pointer py-2.5">
                          Create Account
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-stone-100" />
                  <DropdownMenuItem className="text-[12px] tracking-wide text-stone-600 hover:text-stone-900 cursor-pointer py-2.5">
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[12px] tracking-wide text-stone-600 hover:text-stone-900 cursor-pointer py-2.5">
                    Wishlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Button
              onClick={openDrawer}
                variant="ghost"
                size="icon"
                className="relative w-9 h-9 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-full"
                aria-label="Cart"
              >
                
                  <ShoppingBag size={18} strokeWidth={1.5} />
                
                {totalItems() > 0 && (
                  <span className="absolute top-1 right-1 w-[14px] h-[14px] rounded-full bg-stone-900 text-white text-[8px] flex items-center justify-center font-medium leading-none">
                    {totalItems()}
                  </span>
                )}
              </Button>

              {/* Mobile menu trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden w-9 h-9 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-full"
                    aria-label="Menu"
                  >
                    <Menu size={18} strokeWidth={1.5} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] sm:w-[320px] p-0 border-l border-stone-100"
                >
                  <div className="flex flex-col h-full bg-white">
                    {/* Mobile header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                      <span
                        className="text-lg tracking-[0.3em] uppercase font-semibold text-stone-900"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                        }}
                      >
                        Eissa
                      </span>
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="text-stone-400 hover:text-stone-900 transition-colors"
                      >
                        <X size={18} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Mobile links */}
                    <nav className="flex flex-col px-6 py-6 gap-1">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-[12px] tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 transition-colors py-3 border-b border-stone-50 font-medium"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile auth */}
                    <div className="mt-auto px-6 pb-8 flex flex-col gap-3">
                      <Link to="/signin">
                        <Button
                          variant="outline"
                          className="w-full rounded-none border-stone-900 text-stone-900 text-[11px] tracking-[0.2em] uppercase h-11 hover:bg-stone-900 hover:text-white transition-colors"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Button className="w-full rounded-none bg-stone-900 text-white text-[11px] tracking-[0.2em] uppercase h-11 hover:bg-stone-700 transition-colors">
                        <Link to="/signup">Create Account</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
