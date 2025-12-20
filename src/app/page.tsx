import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { ProductCardSkeleton } from "@/components/ProductSkeleton";
import { Suspense } from "react";
import {
  ChevronDown,
  ShieldCheck,
  ShoppingBag,
  CheckCircle,
  Truck,
  Users,
  Star,
  Quote,
  Package,
  Headphones,
  Globe,
  CreditCard,
  Smartphone,
  Home as HomeIcon,
  Shirt,
  Smartphone as Phone,
  Laptop,
  Sofa,
  Heart,
  BookOpen,
  Car,
  Utensils,
  Gamepad2,
} from "lucide-react";
import {
  AnimatedSection,
  CompactSection,
} from "@/components/ui/animated-section";
import { shopFeatures, testimonials } from "@/lib/constants";

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
                  <Package className="w-8 h-8" />
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
  categories: Array<{ name: string; slug: string; icon: any }>;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
      {categories.map((category, index) => (
        <AnimatedSection
          key={category.slug}
          delay={0.05 * index}
          animation="fadeUp"
          className="h-full"
          spacing="none"
          once
        >
          <Link
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-xl transition-all duration-300 h-full block hover:-translate-y-1 p-6"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <category.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-base group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 group-hover:text-blue-500 transition-colors">
                Shop Now →
              </p>
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}

function TestimonialsSection() {
  return (
    <div className="relative overflow-hidden py-12 sm:py-4 md:py-8">
      {/* Change this fixed light blue background to theme-aware */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection animation="fadeUp" once>
          <div className="text-center mb-8 sm:mb-12">
            {/* Update badge background for dark mode */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-blue-50 dark:bg-blue-900/30">
              <Quote className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                What Kenyan Businesses Say
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Trusted by Kenyan Entrepreneurs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join hundreds of successful Kenyan businesses growing online
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
              {/* Change from fixed white to theme-aware background */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-6 h-full border dark:border-gray-800 hover:-translate-y-1">
                {/* Stars - already OK */}
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
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100 dark:text-blue-900/30" />
                  <p className="leading-relaxed italic pl-4 text-gray-700 dark:text-gray-300">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 border-t pt-4 dark:border-gray-800">
                  {/* Avatar already OK */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats section */}
        <AnimatedSection animation="fade" delay={0.8} once className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { value: "50+", label: "Kenyan Businesses", icon: Users },
              { value: "8+", label: "Industries Served", icon: Globe },
              { value: "98%", label: "Uptime", icon: ShieldCheck },
              { value: "24/7", label: "Support", icon: Headphones },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border dark:border-gray-800"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
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
    { name: "Electronics", slug: "electronics", icon: Phone },
    { name: "Fashion", slug: "fashion", icon: Shirt },
    { name: "Home & Living", slug: "home-living", icon: HomeIcon },
    { name: "Beauty", slug: "beauty", icon: Heart },
    { name: "Phones & Tablets", slug: "phones", icon: Smartphone },
    { name: "Computing", slug: "computing", icon: Laptop },
    { name: "Furniture", slug: "furniture", icon: Sofa },
    { name: "Books & Media", slug: "books", icon: BookOpen },
    { name: "Automotive", slug: "automotive", icon: Car },
    { name: "Groceries", slug: "groceries", icon: Utensils },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)), url('/covers/hero-uniforms.jpg')",
              backgroundPosition: "center 30%",
              backgroundAttachment: "fixed",
            }}
          />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-6xl mx-auto">
            {/* Main Headline */}
            <div className="mb-6 sm:mb-8">
              <AnimatedSection
                animation="fade"
                delay={0.2}
                className="text-center"
                spacing="normal"
                once
              >
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                  <span className="block text-gray-900">Your Complete</span>
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                    E-commerce Solution
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
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Sell Anything, Anywhere in Kenya
                </p>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  From fashion to electronics, furniture to groceries - power
                  your Kenyan business with our complete e-commerce platform
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
                  { text: "M-Pesa Integration", icon: CreditCard },
                  { text: "Mobile-First Design", icon: Smartphone },
                  { text: "Nationwide Delivery", icon: Truck },
                  { text: "24/7 Support", icon: Headphones },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-300 border dark:border-gray-700"
                  >
                    <badge.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                    VIEW DEMO STORE
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-2 border-gray-900 hover:bg-white/20 text-black dark:text-black font-bold py-6 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    GET A QUOTE
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-blue-600/70" />
        </div>
      </section>

      {/* Categories */}
      <CompactSection>
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fadeUp" spacing="none" once>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
              Sell Anything Online
            </h2>
            <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-12">
              Our platform supports all types of Kenyan businesses
            </p>
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
                See how products appear on our platform
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
              <Link href="/products">View Demo Products →</Link>
            </Button>
          </AnimatedSection>
        </div>
      </CompactSection>

      {/* Why Choose Our Platform */}
      <CompactSection className="bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fadeUp" spacing="none" once>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Why Kenyan Businesses Choose Us
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Built for the unique needs of Kenyan e-commerce
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {shopFeatures.map((feature, index) => (
              <AnimatedSection
                key={index}
                animation="fadeUp"
                delay={0.1 * index}
                once
                className="h-full"
                spacing="none"
              >
                {/* Change from fixed white to theme-aware background */}
                <div className="flex flex-col p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 border dark:border-gray-800">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </CompactSection>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <CompactSection className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection animation="fade" once>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Launch Your Online Store?
              </h2>
              <p className="text-xl mb-8 opacity-95">
                Get a custom-built e-commerce solution for your Kenyan business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-white/90 font-bold px-10 py-6 text-lg rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <Link href="/contact">Get Your Custom Store →</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <Link href="/contact">Book a Consultation</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm opacity-80">
                Custom domain • Managed hosting • M-Pesa integration • Kenyan
                support
              </p>
            </div>
          </AnimatedSection>
        </div>
      </CompactSection>
    </div>
  );
}
