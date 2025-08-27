"use client";

import { use, useCallback, useEffect, useState } from "react";
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
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ProductDetailSkeleton } from "@/components/ProductDetailsSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = use(params);

  // Find the product by ID
  const [product, setProduct] = useState<Product>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!param.id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/products/${param.id}`);
      setProduct(res.data.product);
      setRelatedProducts(res.data.relatedProducts || []);
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to fetch product"
      );
      console.error("Product fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [param.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

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

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchProduct} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

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
          {product.images && product.images.length > 0 ? (
            <Carousel className="w-full max-w-md mx-auto">
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
          <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-6 break-words max-w-full">
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
          {relatedProducts.map((relatedProduct) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
