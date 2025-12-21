"use client";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Filter,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  X,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/context/StoreContext";
import { Product } from "@/types/store";
import { FloatingCartButton } from "@/components/cartButton";
import axios from "axios";
import { beltLevels, cn, formatCurrency } from "@/lib/utils";
import { ProductCardSkeleton } from "@/components/ProductSkeleton";
import Image from "next/image";

// Filter options - updated to match your categories array
const categoryOptions = [
  { id: "uniforms", name: "Uniforms" },
  { id: "gear", name: "Protective Gear" },
  { id: "belts", name: "Belts" },
  { id: "equipment", name: "Training Equipment" },
  { id: "womens-fashion", name: "Women's Fashion" },
  { id: "mens-collection", name: "Men's Collection" },
  { id: "electronics", name: "Electronics" },
  { id: "furniture", name: "Furniture" },
  { id: "beauty", name: "Beauty & Cosmetics" },
  { id: "sports-fitness", name: "Sports & Fitness" },
  { id: "baby-kids", name: "Baby & Kids" },
  { id: "groceries", name: "Groceries" },
  { id: "mobile-phones", name: "Mobile Phones" },
  { id: "automotive", name: "Automotive" },
  { id: "books-stationery", name: "Books & Stationery" },
  { id: "health-wellness", name: "Health & Wellness" },
  { id: "jewelry-watches", name: "Jewelry & Watches" },
  { id: "computing", name: "Computing" },
];

const tagOptions = [
  { id: "premium", name: "Premium" },
  { id: "competition", name: "Competition" },
  { id: "training", name: "Training" },
  { id: "protective", name: "Protective" },
  { id: "essential", name: "Essential" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
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
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [selectedBeltLevel, setSelectedBeltLevel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { dispatch } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clickedStates, setClickedStates] = useState<Record<string, boolean>>(
    {}
  );

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/products");
      setProducts(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      console.error("Error fetching products:", err);
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

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the product
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Set animation state
    setClickedStates((prev) => ({ ...prev, [productId]: true }));

    // Dispatch to cart
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity: 1 },
    });

    // Reset after animation
    setTimeout(() => {
      setClickedStates((prev) => ({ ...prev, [productId]: false }));
    }, 1500);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
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
        !selectedTags.some((tag) => product.tags?.includes(tag))
      ) {
        return false;
      }

      // Filter by featured
      if (showFeaturedOnly && !product.featured) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "featured":
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
      }
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
    setShowFeaturedOnly(false);
  };

  // Apply filters and close sheet
  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-2 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => fetchProducts()}
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

      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Demo Platform
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Explore Our Demo Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Pick any product to test the complete checkout experience—from
              adding to cart to payment. This shows how your custom store will
              work.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} products
            </Badge>
          </div>
        </div>

        <Separator className="my-6" />
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {(selectedCategory ||
                  selectedBeltLevel ||
                  selectedTags.length > 0 ||
                  showFeaturedOnly) && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                    {[
                      selectedCategory ? 1 : 0,
                      selectedBeltLevel ? 1 : 0,
                      selectedTags.length,
                      showFeaturedOnly ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>

              <div className="py-6 space-y-6 px-2">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                    {categoryOptions.map((category) => (
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

                <Separator />

                {/* Belt Levels */}
                <div>
                  <h3 className="font-medium mb-3">Belt Level</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="level-all"
                        name="beltLevel"
                        checked={selectedBeltLevel === ""}
                        onChange={() => setSelectedBeltLevel("")}
                        className="h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="level-all" className="ml-2 text-sm">
                        All Levels
                      </label>
                    </div>
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

                <Separator />

                {/* Featured Filter */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="featured-only"
                    className="text-sm font-medium"
                  >
                    Featured Products Only
                  </Label>
                  <Switch
                    id="featured-only"
                    checked={showFeaturedOnly}
                    onCheckedChange={setShowFeaturedOnly}
                  />
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <h3 className="font-medium mb-3">Tags</h3>
                  <div className="space-y-2">
                    {tagOptions.map((tag) => (
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

                <Separator />

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1">
                {categoryOptions.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedBeltLevel && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1">
                Belt: {beltLevels.find((b) => b.id === selectedBeltLevel)?.name}
                <button
                  onClick={() => setSelectedBeltLevel("")}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {selectedTags.map((tagId) => (
              <Badge key={tagId} variant="secondary" className="pl-3 pr-1 py-1">
                {tagOptions.find((t) => t.id === tagId)?.name}
                <button
                  onClick={() => toggleTag(tagId)}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {showFeaturedOnly && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1">
                Featured Only
                <button
                  onClick={() => setShowFeaturedOnly(false)}
                  className="ml-2 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(selectedCategory ||
              selectedBeltLevel ||
              selectedTags.length > 0 ||
              showFeaturedOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-primary hover:text-primary/80 h-8 px-2"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Demo Callout */}
      <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg mb-1">
                Test the Complete Checkout Experience
              </h3>
              <p className="text-sm text-muted-foreground">
                Add products to cart, proceed to checkout, and see how payments,
                shipping, and order confirmation work in a real store.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-blue-300"
            >
              <Link href="/cart">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Cart
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="aspect-square relative">
                    {product.images?.[0] ? (
                      <>
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {product.featured && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500">
                            Featured
                          </Badge>
                        )}

                        {product.belt_level && product.belt_level !== "all" && (
                          <Badge className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm">
                            {
                              beltLevels.find(
                                (b) => b.id === product.belt_level
                              )?.name
                            }
                          </Badge>
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="sm:pb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {product.title}
                    </CardTitle>
                    {product.category && (
                      <p className="text-sm text-muted-foreground capitalize">
                        {categoryOptions.find((c) => c.id === product.category)
                          ?.name || product.category}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                      <div>
                        <p className="text-xl font-bold">
                          {formatCurrency(product.price, product.currency)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatCurrency(
                              product.originalPrice,
                              product.currency
                            )}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </Badge>
                    </div>
                  </CardContent>
                </Link>

                <CardFooter className="pt-0">
                  <Button
                    onClick={(e) => handleAddToCart(product.id, e)}
                    className={cn(
                      "w-full transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      clickedStates[product.id] &&
                        "bg-green-500 hover:bg-green-600"
                    )}
                    disabled={product.stock === 0 || clickedStates[product.id]}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {clickedStates[product.id] ? (
                        <>
                          <Check className="h-4 w-4 animate-[bounce_0.3s]" />
                          <span className="animate-[fadeIn_0.3s]">Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            No products match your filters
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Try adjusting your filters or browse all products.
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 pt-8 border-t text-center">
        <h3 className="text-xl font-semibold mb-4">
          Need a Custom Store Like This?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          This demo shows just a fraction of what we can build for your
          business. Get a fully customized e-commerce platform with your
          products, branding, and features.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Get Your Custom Store Quote</Link>
        </Button>
      </div>
    </div>
  );
}
