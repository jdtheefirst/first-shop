import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="container py-8 px-2 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-6 text-center">
          Shipping Policy
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground text-center mb-8">
            Welcome to the WorldSamma Shop! We know you're excited to get your
            new gear and get back to training. Our goal is to get your order to
            you as quickly and efficiently as possible.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              Shipping At A Glance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-blue-600">$3</div>
                <div className="text-sm font-medium">Nairobi</div>
                <div className="text-xs text-muted-foreground mt-1">
                  1-2 business days
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-blue-600">$5</div>
                <div className="text-sm font-medium">Within Kenya</div>
                <div className="text-xs text-muted-foreground mt-1">
                  2-4 business days
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-2xl font-bold text-blue-600">$10+</div>
                <div className="text-sm font-medium">International</div>
                <div className="text-xs text-muted-foreground mt-1">
                  5-10 business days
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Processing Time</h2>
          <p>
            All orders are processed within <strong>1-2 business days</strong>{" "}
            (excluding weekends and holidays) after you receive your order
            confirmation email. You will receive another notification when your
            order has shipped.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Shipping Rates & Estimates
          </h2>
          <p>We offer transparent pricing with simple flat rates.</p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mt-4 mb-6">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Destination
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Base Rate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Extra Weight Charge
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Delivery Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Nairobi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $3.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $1.00 per kg over 1kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    1-2 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Kenya (outside Nairobi)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $5.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $1.00 per kg over 1kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2-4 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    International
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $10.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $5.00 per kg over 1kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    5-10 business days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>Free shipping</strong> is available for all orders over
            $100.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            How do I check the status of my order?
          </h2>
          <p>
            When your order has shipped, you will receive an email notification
            from us which will include a tracking number you can use to check
            its status. Please allow 48 hours for the tracking information to
            become available.
          </p>
          <p>
            If you haven't received your order within the expected timeframe,
            please contact us at{" "}
            <a
              href="mailto:shop@worldsamma.org"
              className="text-blue-600 hover:underline"
            >
              shop@worldsamma.org
            </a>{" "}
            with your name and order number, and we will look into it for you.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Refunds, Returns, and Exchanges
          </h2>
          <p>
            We want you to be completely satisfied with your gear. Please see
            our{" "}
            <Link href="/returns" className="text-blue-600 hover:underline">
              Returns Policy
            </Link>{" "}
            page for detailed information about your options.
          </p>
        </div>
      </div>
    </div>
  );
}
