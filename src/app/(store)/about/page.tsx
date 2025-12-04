// app/(store)/about/page.jsx
import Link from "next/link";
import { BookOpen, Shield, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Our Shop</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Your trusted source for authentic Samma Martial Arts equipment and
          accessories
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <p className="mb-4">
            At Our Shop, we are dedicated to providing high-quality school
            uniforms that meet the needs of students and educators alike.
          </p>
          <p className="mb-4">
            We believe in the transformative power of a well-designed uniform to
            foster a sense of community, pride, and discipline among students.
          </p>
          <p>
            Our mission is to deliver durable, comfortable, and stylish uniforms
            that enhance the educational experience.
          </p>
        </div>

        <div className="rounded-lg p-6 flex items-center justify-center">
          <div className="text-center p-4">
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Authentic Uniforms</h3>
            <p>
              All our products are approved by Kenya Bureau of Standards and
              designed specifically for school use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
