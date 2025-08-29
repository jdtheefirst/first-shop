// app/(store)/contact/page.jsx
import Link from "next/link";
import { MapPin, Phone, Clock, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-2 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Contact Samma Shop</h1>
        <p className="text-xl max-w-3xl mx-auto">
          We're here to help you with any questions about our products or Samma
          Martial Art
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
          <p className="mb-6">
            Have questions about our products or need assistance with your
            order? Our team is here to help you find the perfect Samma equipment
            for your practice.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Phone Support</h3>
                <p>+254 (729) 498622</p>
                <p className="text-sm text-gray-500">
                  Monday-Friday, 9am-5pm EST
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Email Us</h3>
                <p>support@worldsamma.org</p>
                <p className="text-sm text-gray-500">
                  We respond within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Visit Us</h3>
                <p>Old Malindi Rd</p>
                <p>Mombasa, Kenya</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium">Store Hours</h3>
                <p>Mon-Fri: 10am - 8pm</p>
                <p>Sat-Sun: 10am - 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-8">
          <div className="text-center mb-8">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">
              Samma Martial Art Information
            </h2>
            <p className="mt-2">
              For detailed information about Samma Martial Art, certifications,
              or events, please visit the official Samma blog.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">About Samma Martial Art</h3>
              <p className="text-sm mb-3">
                Learn about the history, philosophy, and techniques of Samma
                Martial Art.
              </p>
              <Link
                href="https://blog.worldsamma.org/about"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                Read more on our blog
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>

            <div className="p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">
                Contact World Samma Federation
              </h3>
              <p className="text-sm mb-3">
                For questions about Samma Martial Art training, certifications,
                or events.
              </p>
              <Link
                href="https://blog.worldsamma.org/contact"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                Visit contact page
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>

            <div className="p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2">Samma Events & Workshops</h3>
              <p className="text-sm mb-3">
                Find upcoming Samma Martial Art events, tournaments, and
                training workshops.
              </p>
              <Link
                href="https://worldsamma.org"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                View events calendar
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          More About Samma Martial Art
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          For comprehensive information about Samma Martial Art philosophy, belt
          rankings, training techniques, and community events, please visit the
          official Samma blog.
        </p>
        <Link
          href="https://blog.worldsamma.org/about"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Explore Samma Blog
        </Link>
      </div>
    </div>
  );
}
