import { useState, type ReactNode } from 'react';

interface FaqItem {
  q: string;
  a: ReactNode;
}

const FAQ: FaqItem[] = [
  {
    q: 'What are credits and how do they work?',
    a: (
      <p>
        Credits are the universal currency that powers every generation in Buzz — images, videos, characters, and avatars. Each model has its own per-generation cost (e.g., Nano Banana = 20 credits / image, Seedance 1.5 Pro = 58 credits / 480p 10s video). Your credits balance refreshes on your billing date each month. Yearly plans deliver all credits upfront at the start of your subscription.
      </p>
    ),
  },
  {
    q: 'What happens if I run out of credits?',
    a: <p>You can upgrade to a higher plan at any time to unlock more credits and continue generating without waiting for your next renewal.</p>,
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: <p>Yes. You can cancel anytime from your account settings. You&rsquo;ll continue to have access to your plan until the end of your current billing period, after which you&rsquo;ll be moved to the Free plan.</p>,
  },
  {
    q: 'How does the Premium Model Access window work?',
    a: (
      <>
        <p>For Starter and Pro plans, premium models (like Nano Banana, Seedance, Veo, Kling) are available for a fixed period after each purchase or renewal:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li><b>Starter</b>: 7 days from your billing date</li>
          <li><b>Pro</b>: 15 days from your billing date</li>
        </ul>
        <p className="mt-2">During the access window, you can use these models freely as long as you have credits. After the window closes, you can still use Seedream 4.5 and Seedream 5.0 Lite. Your access window resets each time your plan renews.</p>
        <p className="mt-2"><b>Ultra and Enterprise</b> plans have full access to all models throughout the entire billing period.</p>
      </>
    ),
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: (
      <>
        <p>You can <b>upgrade</b> to a higher plan at any time. When you upgrade:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li>The new plan takes effect immediately</li>
          <li>Your Premium Model Access window <b>restarts from the upgrade date</b> with the new plan&rsquo;s duration</li>
          <li>Any <b>remaining credits</b> from your previous plan are <b>preserved</b> and added to your new plan&rsquo;s allowance</li>
        </ul>
        <p className="mt-2"><b>Downgrades are not supported.</b> If you want to move to a lower plan, please cancel your current subscription — it will remain active until the end of your billing period, after which you can subscribe to a different plan.</p>
      </>
    ),
  },
  {
    q: 'Do you offer refunds?',
    a: (
      <>
        <p>Subscriptions are <b>non-refundable</b> by default. In cases required by law or special circumstances reviewed and approved by our platform, refunds may be considered. To request a review, please contact our support team at <a href="mailto:info@presslogic.com" className="underline">info@presslogic.com</a>.</p>
        <p className="mt-2">If a refund is approved for an order that includes already-used benefits or credits, the final refund amount may be adjusted based on actual usage, subject to our review.</p>
      </>
    ),
  },
  {
    q: 'Can I use Buzz-generated content commercially?',
    a: <p>Yes. <b>All plans, including Free</b>, include commercial use rights for content you generate in Buzz. You can use the output for ads, social media posts, product images, video content, and any other business use case.</p>,
  },
  {
    q: 'Does Buzz support team or multi-user access?',
    a: <p>Team collaboration is <b>not currently supported</b>. Each subscription is for individual use. We&rsquo;re evaluating team features for future releases — if your organization needs multi-user access, please reach out to our sales team via the Enterprise option, and we can discuss your needs.</p>,
  },
];

export function Faq() {
  return (
    <section className="mt-20 max-w-3xl mx-auto">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
      <div>
        {FAQ.map((item, i) => <FaqItemRow key={i} {...item} />)}
      </div>
    </section>
  );
}

function FaqItemRow({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center gap-4 py-[18px] text-left text-[15px] font-medium"
      >
        <span>{q}</span>
        <span aria-hidden className="text-[22px] text-neutral-500 font-light leading-none flex-shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="text-sm leading-[1.65] text-neutral-700 pb-[18px] -mt-1">
          {a}
        </div>
      )}
    </div>
  );
}
