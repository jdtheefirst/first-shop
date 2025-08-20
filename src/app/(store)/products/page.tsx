"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
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

// Mock product data - in a real app, this would come from the database
const products = [
  {
    id: "1",
    title: "Premium Karate Gi",
    price: 89.99,
    image: "/placeholder-product.jpg",
    category: "uniforms",
    name: "Premium Karate Gi",
    currency: "USD",
    belt_level: "all",
    tags: ["premium", "competition"],
  },
  {
    id: "2",
    title: "Competition Sparring Gear Set",
    price: 129.99,
    image: "/placeholder-product.jpg",
    category: "gear",
    name: "Sparring Gear Set",
    currency: "USD",
    belt_level: "all",
    tags: ["competition", "protective"],
  },
  {
    id: "3",
    title: "Black Belt - Premium Cotton",
    price: 34.99,
    image: "/placeholder-product.jpg",
    category: "belts",
    belt_level: "black",
    name: "Premium Cotton Black Belt",
    currency: "USD",
    tags: ["premium"],
  },
  {
    id: "4",
    title: "Training Gloves",
    price: 49.99,
    image: "/placeholder-product.jpg",
    category: "gear",
    belt_level: "all",
    name: "Gloves",
    currency: "USD",
    tags: ["training", "protective"],
  },
  {
    id: "5",
    title: "White Belt Uniform",
    price: 59.99,
    image: "/placeholder-product.jpg",
    category: "uniforms",
    belt_level: "white",
    name: "White Belt Uniform",
    currency: "USD",
    tags: ["beginner"],
  },
  {
    id: "6",
    title: "Blue Belt Uniform",
    price: 64.99,
    image: "/placeholder-product.jpg",
    category: "uniforms",
    belt_level: "blue",
    name: "Blue Belt Uniform",
    currency: "USD",
    tags: ["intermediate"],
  },
  {
    id: "7",
    title: "Headgear",
    price: 39.99,
    image: "/placeholder-product.jpg",
    category: "gear",
    belt_level: "all",
    name: "Premium Cotton Black Belt",
    currency: "USD",
    tags: ["protective", "training"],
  },
  {
    id: "8",
    title: "Mouth Guard",
    price: 12.99,
    image: "/placeholder-product.jpg",
    category: "gear",
    belt_level: "all",
    name: "Premium Cotton Black Belt",
    currency: "USD",
    tags: ["protective", "essential"],
  },
];

// Filter options
const categories = [
  { id: "uniforms", name: "Uniforms" },
  { id: "gear", name: "Protective Gear" },
  { id: "belts", name: "Belts" },
  { id: "equipment", name: "Training Equipment" },
];

const beltLevels = [
  { id: "all", name: "All Levels" },
  { id: "white", name: "White Belt" },
  { id: "yellow", name: "Yellow Belt" },
  { id: "orange", name: "Orange Belt" },
  { id: "green", name: "Green Belt" },
  { id: "blue", name: "Blue Belt" },
  { id: "purple", name: "Purple Belt" },
  { id: "brown", name: "Brown Belt" },
  { id: "black", name: "Black Belt" },
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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const { state } = useStore();
  const orderData = state.pendingOrder;

  if (orderData && orderData.items.length > 0) {
    redirect("/checkout/payment");
  }

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBeltLevel, setSelectedBeltLevel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

              <div className="py-6 space-y-6">
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
        {filteredProducts.map((product) => (
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
              {product.belt_level !== "all" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {beltLevels.find((b) => b.id === product.belt_level)?.name}
                </p>
              )}
            </div>
            <button
              onClick={() =>
                handleAddToCart({
                  ...product,
                })
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm
             px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
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
