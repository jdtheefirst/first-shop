import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";
import { beltLevels, formatCurrency } from "@/lib/utils";
import { ProductCardSkeleton } from "@/components/ProductSkeleton";
import { Suspense } from "react";
import {
  ChevronDown,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  CheckCircle,
  Truck,
  Users,
  Award,
  Star,
  Quote,
} from "lucide-react";
import {
  AnimatedSection,
  CompactSection,
} from "@/components/ui/animated-section";

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
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product, index) => (
        <AnimatedSection
          key={product.id}
          delay={0.05 * index}
          animation="fadeUp"
          className="h-full"
          spacing="none"
          once
        >
          <Link
            href={`/products/${product.slug}`}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
          >
            <div className="aspect-square relative flex-shrink-0">
              {product.images?.[0] ? (
                <>
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 480px) 50vw,
                           (max-width: 768px) 33vw,
                           (max-width: 1024px) 25vw,
                           20vw"
                    priority={false}
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

                  {/* Badge for belt level */}
                  {product.belt_level !== "all" && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {
                        beltLevels.find((b) => b.id === product.belt_level)
                          ?.name
                      }
                    </div>
                  )}

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1 transition-colors group-hover:text-blue-300">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                          {formatCurrency(product.price, product.currency)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(
                              product.originalPrice,
                              product.currency
                            )}
                          </span>
                        )}
                      </div>
                      <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                  <Shirt className="w-8 h-8" />
                </div>
              )}
            </div>
          </Link>
        </AnimatedSection>
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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {categories.map((category, index) => (
        <AnimatedSection
          key={category.slug}
          delay={0.1 * index}
          animation="fadeUp"
          className="h-full"
          spacing="none"
          once
        >
          <Link
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full block hover:-translate-y-1"
          >
            <div className="aspect-square relative">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 480px) 50vw,
                       (max-width: 768px) 33vw,
                       (max-width: 1024px) 25vw,
                       20vw"
              />
              {/* Darker overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Category content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
                  {category.slug === "uniforms" && (
                    <Shirt className="w-6 h-6 sm:w-8 sm:h-8" />
                  )}
                  {category.slug === "gear" && (
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
                  )}
                  {category.slug === "belts" && (
                    <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                  )}
                  {category.slug === "equipment" && (
                    <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                  )}
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-center group-hover:text-blue-300 transition-colors">
                  {category.name}
                </h3>
                <span className="mt-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Mwangi Kimani",
      role: "School Principal, Nairobi",
      content:
        "For 3 years now, our entire school has been getting uniforms from here. The quality is exceptional - even after daily use and washing, they still look new. Best investment for our students!",
      rating: 5,
      image: "/testimonials/principal.jpg",
    },
    {
      name: "Grace Wanjiru",
      role: "Martial Arts Academy Owner, Mombasa",
      content:
        "The custom embroidery on our dojo uniforms has brought us so many new students! Parents appreciate the professional look. Plus, the bulk discount for our 50+ students saved us a lot.",
      rating: 5,
      image: "/testimonials/academy-owner.jpg",
    },
    {
      name: "David Omondi",
      role: "Sports Club Manager, Kisumu",
      content:
        "Fastest delivery to western Kenya I've experienced. Ordered uniforms on Monday, had them by Thursday. The fabric is perfect for our hot climate - breathable yet durable.",
      rating: 5,
      image: "/testimonials/club-manager.jpg",
    },
    {
      name: "Sarah Akinyi",
      role: "Taekwondo Instructor, Nakuru",
      content:
        "As a female instructor, finding properly fitting uniforms was always a challenge. Their custom sizing option was a game-changer! My students now train comfortably and confidently.",
      rating: 5,
      image: "/testimonials/instructor.jpg",
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 sm:py-4 md:py-8">
      {/* Background pattern */}
      <div className="absolute inset-0" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          /* Add to your styles or inline style */
          backgroundImage: `linear-gradient(45deg, #060 25%, transparent 25%), 
                  linear-gradient(-45deg, #060 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #060 75%), 
                  linear-gradient(-45deg, transparent 75%, #060 75%)`,
          backgroundSize: `20px 20px`,
          backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection animation="fadeUp" once>
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4">
              <Quote className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                What Kenyan Schools Say
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Trusted by Schools Across Kenya
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from principals, instructors, and club owners who've elevated
              their teams
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={index}
              animation="fadeUp"
              delay={0.2 * index}
              once
              className="h-full"
              spacing="none"
            >
              <div className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-6 h-full border border-gray-100 hover:-translate-y-1">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote content */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100" />
                  <p className="leading-relaxed italic pl-4">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats */}
        <AnimatedSection animation="fade" delay={0.8} once className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { value: "50+", label: "Schools & Clubs" },
              { value: "10,000+", label: "Uniforms Delivered" },
              { value: "47", label: "Counties Served" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border"
              >
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

export default async function Home() {
  const featuredProducts = await fetchFeatured();

  const categories = [
    { name: "Uniforms", slug: "uniforms", image: "/categories/uniforms.jpg" },
    { name: "Protective Gear", slug: "gear", image: "/categories/gear.jpg" },
    { name: "Belts", slug: "belts", image: "/categories/belts.jpg" },
    {
      name: "Training Equipment",
      slug: "equipment",
      image: "/categories/equipment.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] w-full bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/covers/hero-uniforms.jpg')",
          backgroundPosition: "center 30%",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10" />

        <div className="px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-4xl mx-auto">
            {/* Main Headline */}
            <div className="mb-6 sm:mb-8">
              <AnimatedSection
                animation="fade"
                delay={0.2}
                className="text-center"
                spacing="normal"
                once
              >
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent">
                    PROFESSIONAL{" "}
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                    UNIFORMS
                  </span>
                </h1>
              </AnimatedSection>
            </div>

            {/* Subheading */}
            <AnimatedSection
              animation="fadeUp"
              delay={0.4}
              className="text-center"
              spacing="none"
              once
            >
              <div className="mb-8 sm:mb-12">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                  Premium Quality • Custom Fit • Bulk Orders
                </p>
                <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto drop-shadow">
                  Elevate your team's presence with our exclusive collection
                </p>
              </div>
            </AnimatedSection>

            {/* Feature badges */}
            <AnimatedSection
              animation="fadeUp"
              delay={0.6}
              className="mb-8 sm:mb-12"
              spacing="none"
              once
            >
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {[
                  {
                    text: "Free Shipping Nationwide",
                    color: "from-green-500/90 to-emerald-400/90",
                  },
                  {
                    text: "Custom Embroidery",
                    color: "from-blue-500/90 to-cyan-400/90",
                  },
                  {
                    text: "Bulk Discounts",
                    color: "from-amber-500/90 to-yellow-400/90",
                  },
                  {
                    text: "50+ Kenyan Schools",
                    color: "from-purple-500/90 to-pink-400/90",
                  },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${badge.color} backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20`}
                  >
                    {badge.text}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection
              animation="fadeUp"
              delay={0.8}
              className="mb-8"
              spacing="none"
              once
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-blue-500/40 w-full sm:w-auto"
                >
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    SHOP COLLECTION
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/40 hover:bg-white/20 text-white font-bold py-6 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2"
                  >
                    <Shirt className="w-5 h-5" />
                    CONTACT FOR BULK
                  </Link>
                </Button>
              </div>
            </AnimatedSection>

            {/* Trust indicator */}
            <AnimatedSection animation="fade" delay={1} spacing="none" once>
              <div className="mt-8 pt-6 border-t border-white/30">
                <p className="text-white/90 text-sm flex items-center justify-center gap-2 flex-wrap">
                  <ShieldCheck className="w-4 h-4" />
                  Trusted by Kenyan schools from Mombasa to Kisumu
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </section>

      {/* Featured Categories */}
      <CompactSection>
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fadeUp" spacing="none" once>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
              Shop by Category
            </h2>
          </AnimatedSection>
          <CategoriesGrid categories={categories} />
        </div>
      </CompactSection>

      {/* Featured Products */}
      <CompactSection className="bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fadeUp" spacing="none" once>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Featured Products
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Top picks from our premium collection
              </p>
            </div>
          </AnimatedSection>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            }
          >
            <FeaturedProductsGrid products={featuredProducts} />
          </Suspense>

          <AnimatedSection
            animation="fadeUp"
            delay={0.3}
            once
            className="mt-8 sm:mt-12 text-center"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base hover:scale-105 transition-transform duration-300"
            >
              <Link href="/products">View All Products →</Link>
            </Button>
          </AnimatedSection>
        </div>
      </CompactSection>

      {/* Why Choose Us */}
      <CompactSection className="bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fadeUp" spacing="none" once>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Why Choose Our Store
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Excellence in every detail
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: CheckCircle,
                title: "Premium Kenyan Quality",
                description:
                  "Durable fabrics perfect for our climate, expert craftsmanship for long-lasting uniforms",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Truck,
                title: "Nationwide Delivery",
                description:
                  "Fast delivery to all 47 counties, from Nairobi to remote areas",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "School Discounts",
                description:
                  "Special rates and custom solutions for Kenyan schools & teams",
                color: "from-purple-500 to-pink-500",
              },
            ].map((feature, index) => (
              <AnimatedSection
                key={index}
                animation="fadeUp"
                delay={0.1 * index}
                once
                className="h-full"
                spacing="none"
              >
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 border">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </CompactSection>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA */}
      <CompactSection className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection animation="fade" once>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Elevate Your Kenyan School?
              </h2>
              <p className="text-xl mb-8 opacity-95">
                Join 50+ Kenyan schools already using our premium uniforms
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-white/90 font-bold px-10 py-6 text-lg rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <Link href="/products">Shop the Collection →</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-black hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <Link href="/contact">Request Bulk Quote</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm opacity-80">
                Free consultation for schools ordering 20+ uniforms
              </p>
            </div>
          </AnimatedSection>
        </div>
      </CompactSection>
    </div>
  );
}
