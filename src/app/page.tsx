import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";
import { beltLevels, formatCurrency } from "@/lib/utils";
import { ProductCardSkeleton } from "@/components/ProductSkeleton";
import { Suspense } from "react";
import { ChevronDown, ShieldCheck, Shirt, ShoppingBag } from "lucide-react";

async function fetchFeatured() {
  let featuredProducts: Product[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/featured`
    );

    if (response.ok) {
      featuredProducts = await response.json();
    } else {
      console.error("Failed to fetch featured products:", response.status);
    }
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }
  return featuredProducts;
}

function FeaturedProductsGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group relative overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
        >
          <div className="aspect-square relative flex-shrink-0">
            {product.images?.[0] ? (
              <>
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 480px) 50vw,
                         (max-width: 768px) 33vw,
                         (max-width: 1024px) 25vw,
                         20vw"
                  priority={false}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-2 group-hover:text-blue-300 transition-colors mb-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <p className="font-medium">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                    <p className="capitalize opacity-80">{product.category}</p>
                  </div>
                  {product.belt_level !== "all" && (
                    <p className="mt-1 text-xs opacity-70">
                      {
                        beltLevels.find((b) => b.id === product.belt_level)
                          ?.name
                      }
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                No Image
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function CategoriesGrid({
  categories,
}: {
  categories: Array<{ name: string; slug: string; image: string }>;
}) {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
        >
          <div className="aspect-square relative">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 480px) 50vw,
                     (max-width: 768px) 33vw,
                     (max-width: 1024px) 25vw,
                     20vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80" />

            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-2 group-hover:text-blue-300 transition-colors">
                {category.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function Home() {
  const featuredProducts = await fetchFeatured();

  // Mock categories
  const categories = [
    { name: "Uniforms", slug: "uniforms", image: "/categories/uniforms.jpg" },
    {
      name: "Protective Gear",
      slug: "gear",
      image: "/categories/gear.jpg",
    },
    { name: "Belts", slug: "belts", image: "/categories/belts.jpg" },
    {
      name: "Training Equipment",
      slug: "equipment",
      image: "/categories/equipment.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Fixed for mobile */}
      <section
        className="relative min-h-[500px] sm:h-[600px] w-full bg-cover bg-center flex items-center justify-center py-8 sm:py-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.7)), url('/covers/hero-uniforms.jpg')",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-4xl mx-auto">
            {/* Main Headline - Responsive sizes */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                  PROFESSIONAL
                </span>
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient mt-1 sm:mt-0">
                  UNIFORMS
                </span>
              </div>
            </div>

            {/* Subheading - Better mobile spacing */}
            <div className="mb-6 sm:mb-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white/90">
                  Elevate Your Team's Presence
                </p>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                Premium Quality • Custom Fit • Bulk Orders
              </p>
            </div>

            {/* Feature badges - Stack on mobile */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="font-medium text-white truncate">
                  Free Shipping
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="font-medium text-white truncate">
                  Custom Embroidery
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="font-medium text-white truncate">
                  Bulk Discounts
                </span>
              </div>
            </div>

            {/* CTA Buttons - Responsive centering */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-xl text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl shadow-blue-500/30 w-full sm:w-auto"
              >
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-1 sm:gap-2"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  SHOP COLLECTION
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-xl text-sm sm:text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-1 sm:gap-2"
                >
                  <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
                  CONTACT US
                </Link>
              </Button>
            </div>

            {/* Trust indicator - Better mobile text */}
            <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/20">
              <p className="text-white/70 text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 flex-wrap justify-center">
                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                Trusted by 50+ Schools & Businesses Nationwide
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Smaller on mobile */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 text-white/60" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-12">
            Shop by Category
          </h2>
          <CategoriesGrid categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-12">
            Featured Products
          </h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            }
          >
            <FeaturedProductsGrid products={featuredProducts} />
          </Suspense>
          <div className="mt-6 sm:mt-12 text-center">
            <Button asChild size="lg" className="text-sm sm:text-base">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Features */}
      <section className="py-8 sm:py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-12">
            Why Choose Our Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg bg-background shadow-sm">
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
                <span className="text-primary text-base sm:text-xl">✓</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                Quality Uniforms
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                All our products are carefully selected to ensure durability and
                comfort.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg bg-background shadow-sm">
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
                <span className="text-primary text-base sm:text-xl">✓</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                Expert Advice
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Our team can help you find the right uniforms to fit your needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg bg-background shadow-sm">
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
                <span className="text-primary text-base sm:text-xl">✓</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                Fast Shipping
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Quick delivery options to get your uniform as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Elevate Your School?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-8 max-w-2xl mx-auto px-2">
            Discover our premium selection of uniforms and take your school to
            the next level.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-sm sm:text-base"
          >
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
