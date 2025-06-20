export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you use BookNest, we may collect the following information:
        </p>
        <ul>
          <li>Account information (email, username) when you sign up</li>
          <li>Books you share and comments you make</li>
          <li>Usage data and analytics to improve our service</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Communicate with you about your account</li>
          <li>Improve and personalize your experience</li>
          <li>Ensure the security of our platform</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties 
          without your consent, except as described in this policy or as required by law.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against 
          unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at privacy@booknest.com
        </p>
      </div>
    </div>
  );
}
