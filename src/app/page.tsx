import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Mock featured products - in a real app, these would come from the database
  const featuredProducts = [
    {
      id: "1",
      title: "Premium Karate Gi",
      price: 89.99,
      image: "/placeholder-product.jpg",
      category: "uniforms",
      belt_level: "all",
    },
    {
      id: "2",
      title: "Competition Sparring Gear Set",
      price: 129.99,
      image: "/placeholder-product.jpg",
      category: "gear",
      belt_level: "all",
    },
    {
      id: "3",
      title: "Black Belt - Premium Cotton",
      price: 34.99,
      image: "/placeholder-product.jpg",
      category: "belts",
      belt_level: "black",
    },
    {
      id: "4",
      title: "Training Gloves",
      price: 49.99,
      image: "/placeholder-product.jpg",
      category: "gear",
      belt_level: "all",
    },
  ];

  // Mock categories
  const categories = [
    { name: "Uniforms", slug: "uniforms", image: "/placeholder-category.jpg" },
    {
      name: "Protective Gear",
      slug: "gear",
      image: "/placeholder-category.jpg",
    },
    { name: "Belts", slug: "belts", image: "/placeholder-category.jpg" },
    {
      name: "Training Equipment",
      slug: "equipment",
      image: "/placeholder-category.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen px-2">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            World Samma Academy Shop
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Quality gear for every martial artist
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900 to-neutral-700" />
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square relative bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-square relative bg-muted">
                  {/* In a real app, this would be a real product image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Product Image
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{product.title}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {product.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Features */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Samma Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Gear</h3>
              <p className="text-muted-foreground">
                All our products are carefully selected to ensure durability and
                performance.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
              <p className="text-muted-foreground">
                Our team of martial arts practitioners can help you find the
                right equipment.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                We offer quick delivery options to get you training with your
                new gear as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Training?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover our premium selection of martial arts gear and take your
            practice to the next level.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
