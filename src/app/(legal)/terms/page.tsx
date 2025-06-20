export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using BookNest, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>

        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily use BookNest for personal, non-commercial 
          transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2>User Content</h2>
        <p>
          Users are responsible for the content they share on BookNest. By sharing content, 
          you grant us a non-exclusive license to use, display, and distribute your content 
          on our platform.
        </p>

        <h2>Prohibited Uses</h2>
        <p>You may not use BookNest:</p>
        <ul>
          <li>For any unlawful purpose or to solicit others to act unlawfully</li>
          <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
          <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
          <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
          <li>To submit false or misleading information</li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          The information on this website is provided on an "as is" basis. To the fullest extent 
          permitted by law, this Company excludes all representations, warranties, conditions and 
          terms relating to our website and the use of this website.
        </p>

        <h2>Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at legal@booknest.com
        </p>
      </div>
    </div>
  );
}
