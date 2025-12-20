import { categories } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <div className="container py-8 px-2 sm:px-4 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Shop by Category</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          This platform supports all types of e-commerce businesses. Currently
          showing:
          <span className="font-semibold"> Martial Arts Store</span>
        </p>
        <div className="mt-6">
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            View as General Store
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="aspect-video relative bg-muted">
              <Image
                src={category.image} // Replace with the actual image path or URL
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" // Optional: Provide a base64 placeholder
                loading="lazy"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

              <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white z-20">
                {category.name}
              </h2>
            </div>
            <div className="p-4 bg-background flex-grow">
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
