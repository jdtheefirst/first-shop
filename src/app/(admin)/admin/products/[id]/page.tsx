"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

// Mock product data - in a real app, this would come from the database
const products = [
  {
    id: "1",
    title: "Premium Karate Gi",
    sku: "KG-001",
    description:
      "High-quality karate uniform made from premium cotton. Durable and comfortable for training and competitions. Available in various sizes.",
    price: 89.99,
    stock: 15,
    category: "uniforms",
    belt_level: "all",
    tags: "premium, competition",
  },
  {
    id: "2",
    title: "Competition Sparring Gear Set",
    sku: "SG-001",
    description:
      "Complete set of protective gear for martial arts competitions. Includes headgear, gloves, foot protectors, and mouthguard. Approved for tournament use.",
    price: 129.99,
    stock: 8,
    category: "gear",
    belt_level: "all",
    tags: "competition, protective",
  },
];

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the product from the database
    const fetchProduct = async () => {
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find product by ID
        const foundProduct = products.find((p) => p.id === params.id);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Product not found, redirect to products page
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Handle error, maybe redirect to products page
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <div className="bg-background rounded-lg border p-6">
        <ProductForm initialData={product} isEditing={true} />
      </div>
    </div>
  );
}
