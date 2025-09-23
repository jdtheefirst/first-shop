"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ChevronLeft,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/context/StoreContext";
import { Product } from "@/types/store";
import { FloatingCartButton } from "@/components/cartButton";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EmptyState } from "@/components/EmptyState";
import ProductShare from "./ProductShare";

export default function ProductDetailPage({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const url = `${window.location.origin}/products/${product.id}`;

  useEffect(() => {
    if (!api) return;

    const updateIndex = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    // Update initially
    updateIndex();

    // Listen to carousel slide changes
    api.on("select", updateIndex);

    return () => {
      api.off("select", updateIndex);
    };
  }, [api]);

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
        <div className="rounded-lg overflow-hidden">
          {product.images?.length ? (
            <div className="flex flex-col w-full max-w-md mx-auto">
              {/* Main carousel */}
              <Carousel className="w-full max-w-md mx-auto" setApi={setApi}>
                <CarouselContent>
                  {product.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="aspect-square relative">
                        <Image
                          src={img}
                          alt={product.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {/* Thumbnail row */}
              <div className="mt-4 flex justify-center p-2 gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => api?.scrollTo(idx)}
                    className={`relative w-16 h-16 border rounded-md overflow-hidden ${
                      activeIndex === idx ? "ring-2 ring-primary" : "opacity-70"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
              <div className="flex w-full items-center justify-center flex-col">
                <ProductShare url={url} product={product} />
              </div>
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
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

          {/* Render Markdown */}
          <div
            className="prose prose-sm dark:prose-invert text-muted-foreground mb-6 break-words max-w-full
             [&>hr]:my-6 [&>hr]:border-t [&>hr]:border-muted"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {product.description}
            </ReactMarkdown>
          </div>

          {/* Tags */}
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

          {/* Availability */}
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

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              disabled={product.stock === 0}
              onClick={() => handleAddToCart({ ...product })}
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
          {relatedProducts.length > 0 ? (
            <EmptyState
              title="No Related Products"
              description="We couldn't find any related products at the moment."
              icon="boxs"
              action={
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              }
            />
          ) : (
            relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="group overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="rounded-lg overflow-hidden">
                  {relatedProduct.images && relatedProduct.images.length > 0 ? (
                    <Carousel className="w-full max-w-md mx-auto">
                      <CarouselContent>
                        {relatedProduct.images.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="aspect-square relative">
                              <Image
                                src={img}
                                alt={relatedProduct.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : (
                    <div className="aspect-square flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
