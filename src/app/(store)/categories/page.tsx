import Link from "next/link";

// Mock categories - in a real app, these would come from the database
const categories = [
  {
    name: "Uniforms (Gi)",
    slug: "uniforms",
    description:
      "Find the perfect Gi for your training, from lightweight single weaves for everyday practice to durable double weaves for competition.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Protective Gear",
    slug: "gear",
    description:
      "Safety first. Browse our selection of headgear, gloves, shin guards, and mouthguards to stay protected during sparring.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Belts",
    slug: "belts",
    description:
      "Mark your journey and rank progression with our high-quality, durable martial arts belts.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Training Equipment",
    slug: "equipment",
    description:
      "From focus mitts to punching bags, get the equipment you need to sharpen your skills and enhance your training.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Merch & Apparel",
    slug: "merch",
    description:
      "Rep Samma Martial Arts outside the dojo with branded t-shirts, hoodies, caps, and streetwear.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description:
      "From keychains to gym bags and water bottles, carry your Samma pride everywhere.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Home & Lifestyle",
    slug: "home",
    description:
      "Bring the spirit of Samma into your home with mugs, posters, utensils, and décor.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Books & Media",
    slug: "media",
    description:
      "Dive deeper into the art with training manuals, philosophy books, and exclusive Samma documentaries.",
    image: "/placeholder-category.jpg",
  },
  {
    name: "Kids & Juniors",
    slug: "kids",
    description:
      "Specially designed uniforms, gear, and fun merch for the next generation of Samma warriors.",
    image: "/placeholder-category.jpg",
  },
];

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Shop by Category</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Whether you're a seasoned black belt or just starting your journey, we
          have the gear you need to perform your best.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="aspect-video relative bg-muted">
              {/* In a real app, this would be a real category image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Category Image
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
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
