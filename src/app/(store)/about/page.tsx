// app/(store)/about/page.jsx
import Link from "next/link";
import { BookOpen, Shield, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Samma Shop</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Your trusted source for authentic Samma Martial Arts equipment and
          accessories
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <p className="mb-4">
            At Samma Shop, we are dedicated to supporting the global Samma
            community by providing high-quality martial arts gear, fitness
            equipment, and authentic Samma products.
          </p>
          <p className="mb-4">
            We believe in the transformative power of Samma Martial Arts and
            strive to make premium equipment accessible to practitioners at all
            levels.
          </p>
          <div className="mt-8">
            <Link
              href="https://blog.worldsamma.org/about"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-blue-800 font-medium"
            >
              Learn more about Samma Martial Arts
              <BookOpen className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="rounded-lg p-6 flex items-center justify-center">
          <div className="text-center p-4">
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">
              Authentic Samma Products
            </h3>
            <p>
              All our products are approved by World Samma organization and
              designed specifically for Samma practitioners.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          The Samma Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Discipline</h3>
            <p>Cultivating mental and physical discipline through practice</p>
          </div>
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Protection</h3>
            <p>Learning self-defense while respecting others</p>
          </div>
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Community</h3>
            <p>Building strong connections with fellow practitioners</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Join the Samma Community
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          We're proud to support Samma Martial Arts practitioners worldwide with
          quality equipment and resources to enhance their practice.
        </p>
        <Link
          href="https://blog.worldsamma.org/about"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Discover More About Samma
        </Link>
      </div>
    </div>
  );
}
