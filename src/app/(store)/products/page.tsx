"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useStore } from "@/lib/context/StoreContext";
import { Product } from "@/types/store";
import { FloatingCartButton } from "@/components/cartButton";
import axios from "axios";
import { beltLevels } from "@/lib/utils";
import { ProductCardSkeleton } from "@/components/ProductSkeleton";
import Image from "next/image";

// Filter options
const categories = [
  { id: "uniforms", name: "Uniforms" },
  { id: "gear", name: "Protective Gear" },
  { id: "belts", name: "Belts" },
  { id: "equipment", name: "Training Equipment" },
];

const tags = [
  { id: "premium", name: "Premium" },
  { id: "competition", name: "Competition" },
  { id: "training", name: "Training" },
  { id: "protective", name: "Protective" },
  { id: "essential", name: "Essential" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = use(searchParams);
  const { state } = useStore();
  const orderData = state.pendingOrder;
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedBeltLevel, setSelectedBeltLevel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { dispatch } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setProducts(res.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!orderData) {
      fetchProducts();
    } else {
      router.push("/checkout/payment");
    }
  }, [orderData, fetchProducts, router]);

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        quantity: 1,
      },
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    // Filter by belt level
    if (
      selectedBeltLevel &&
      product.belt_level !== selectedBeltLevel &&
      product.belt_level !== "all"
    ) {
      return false;
    }

    // Filter by tags
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((tag) => product.tags.includes(tag))
    ) {
      return false;
    }

    return true;
  });

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBeltLevel("");
    setSelectedTags([]);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            variant={"destructive"}
            onClick={() => router.refresh()}
            className="w-full sm:w-auto cursor-pointer"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2">
      <FloatingCartButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="py-6 space-y-6 px-2">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${category.id}`}
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 text-sm"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Belt Levels */}
                <div>
                  <h3 className="font-medium mb-3">Belt Level</h3>
                  <div className="space-y-2">
                    {beltLevels.map((level) => (
                      <div key={level.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`level-${level.id}`}
                          name="beltLevel"
                          checked={selectedBeltLevel === level.id}
                          onChange={() => setSelectedBeltLevel(level.id)}
                          className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`level-${level.id}`}
                          className="ml-2 text-sm"
                        >
                          {level.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-medium mb-3">Tags</h3>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="ml-2 text-sm"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative w-full md:w-auto">
            <select
              className="w-full md:w-auto appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              defaultValue="featured"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory || selectedBeltLevel || selectedTags.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory && (
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
              Category:{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory("")}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
          )}

          {selectedBeltLevel && (
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
              Belt: {beltLevels.find((b) => b.id === selectedBeltLevel)?.name}
              <button
                onClick={() => setSelectedBeltLevel("")}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
          )}

          {selectedTags.map((tagId) => (
            <div
              key={tagId}
              className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm"
            >
              {tags.find((t) => t.id === tagId)?.name}
              <button
                onClick={() => toggleTag(tagId)}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? // Show skeleton loaders while loading
            Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-square relative">
                  {product.images?.[0] ? (
                    <>
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 
                   (max-width: 1200px) 50vw, 
                   33vw"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Text overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-300 transition-colors">
                          {product.title}
                        </h3>
                        <div className="mt-1 flex items-center justify-between text-sm">
                          <p className="font-medium">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="capitalize opacity-80">
                            {product.category}
                          </p>
                        </div>
                        {product.belt_level !== "all" && (
                          <p className="mt-1 text-xs opacity-70">
                            {
                              beltLevels.find(
                                (b) => b.id === product.belt_level
                              )?.name
                            }
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                {/* Floating Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart({ ...product })}
                  className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md 
        hover:from-blue-700 hover:to-blue-800 transition-all shadow-md
        px-3 py-1.5 text-xs sm:text-sm opacity-0 group-hover:opacity-100 
        translate-y-[-8px] group-hover:translate-y-0 duration-300"
                >
                  Add to Cart
                </button>
              </Link>
            ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search criteria.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
