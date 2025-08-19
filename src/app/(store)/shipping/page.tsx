export default function ShippingPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="bg-background rounded-lg border p-6 md:p-10">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Shipping Policy
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Welcome to the WorldSamma Shop! We know you're excited to get your
            new gear and get back to training. Our goal is to get your order to
            you as quickly and efficiently as possible, just like a
            well-executed technique.
          </p>

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
          <p>We offer flat-rate shipping to keep things simple.</p>
          <ul>
            <li>
              <strong>Standard Shipping (Nairobi):</strong> KES 300 (1-2
              business days)
            </li>
            <li>
              <strong>Standard Shipping (Rest of Kenya):</strong> KES 500 (2-4
              business days)
            </li>
            <li>
              <strong>International Shipping:</strong> Currently, we only ship
              within Kenya. We are working on expanding our dojo to the rest of
              the world soon!
            </li>
          </ul>
          <p>
            <strong>Free shipping</strong> is available for all orders over KES
            5,000.
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
            If you haven't received your order within 5 days of receiving your
            shipping confirmation email, please contact us at{" "}
            <a href="mailto:shop@worldsamma.org">shop@worldsamma.org</a> with
            your name and order number, and we will look into it for you.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Refunds, Returns, and Exchanges
          </h2>
          <p>
            We want you to be completely satisfied with your gear. Please see
            our <a href="/returns">Returns Policy</a> page for detailed
            information about your options.
          </p>
        </div>
      </div>
    </div>
  );
}
