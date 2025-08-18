"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/context/StoreContext";
import { Product } from "@/types/store";
import { FloatingCartButton } from "@/components/cartButton";

// Mock product data - in a real app, this would come from the database
const products = [
  {
    id: "1",
    title: "Premium Karate Gi",
    price: 89.99,
    description:
      "High-quality karate uniform made from premium cotton. Durable and comfortable for training and competitions. Available in various sizes.",
    image: "/placeholder-product.jpg",
    category: "uniforms",
    belt_level: "all",
    name: "Premium Cotton Black Belt",
    currency: "USD",
    tags: ["premium", "competition"],
    stock: 15,
  },
  {
    id: "2",
    title: "Competition Sparring Gear Set",
    price: 129.99,
    description:
      "Complete set of protective gear for martial arts competitions. Includes headgear, gloves, foot protectors, and mouthguard. Approved for tournament use.",
    image: "/placeholder-product.jpg",
    category: "gear",
    belt_level: "all",
    name: "Premium Cotton Black Belt",
    currency: "USD",
    tags: ["competition", "protective"],
    stock: 8,
  },
];

// Related products - in a real app, this would be dynamically generated
const relatedProducts = [
  {
    id: "3",
    title: "Black Belt - Premium Cotton",
    price: 34.99,
    image: "/placeholder-product.jpg",
    category: "belts",
  },
  {
    id: "4",
    title: "Training Gloves",
    price: 49.99,
    image: "/placeholder-product.jpg",
    category: "gear",
  },
  {
    id: "5",
    title: "White Belt Uniform",
    price: 59.99,
    image: "/placeholder-product.jpg",
    category: "uniforms",
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [quantity, setQuantity] = useState(1);

  // Find the product by ID
  const product = products.find((p) => p.id === params.id);

  // If product not found, show error
  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart function
  const { dispatch } = useStore();

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        quantity: 1,
      },
    });
  };

  return (
    <div className="container mx-auto py-8 px-2">
      <FloatingCartButton />
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/products"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
          {/* In a real app, this would be a real product image */}
          <div className="text-muted-foreground">Product Image</div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-2xl font-semibold">
              ${product.price.toFixed(2)}
            </p>
            <div className="text-sm px-2 py-1 bg-muted rounded-full">
              {product.category}
            </div>
            {product.belt_level !== "all" && (
              <div className="text-sm px-2 py-1 bg-muted rounded-full">
                {product.belt_level} belt
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-muted rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Availability:</p>
            <p
              className={product.stock > 0 ? "text-green-600" : "text-red-600"}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-center w-12">{quantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              disabled={product.stock === 0}
              onClick={() =>
                handleAddToCart({
                  ...product,
                })
              }
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.id}`}
              className="group overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-square relative bg-muted">
                {/* In a real app, this would be a real product image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Product Image
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium line-clamp-1">
                  {relatedProduct.title}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <p className="font-semibold">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {relatedProduct.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
