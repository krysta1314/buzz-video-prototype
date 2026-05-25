import { useState, type ReactNode } from 'react';

interface FaqItem {
  q: string;
  a: ReactNode;
}

const FAQ: FaqItem[] = [
  {
    q: 'What are credits and how do they work?',
    a: (
      <>
        <p>Every time you generate something — an image, a video, or a marketing-agent task — you spend credits. Different models cost different amounts (see the Compare Features table for exact costs).</p>
        <p className="mt-2">How your credits refill depends on your plan:</p>
        <ul className="mt-1 pl-5 list-disc space-y-1">
          <li><b>Free</b>: you get 500 credits once. They don&rsquo;t refill — when they&rsquo;re gone, you&rsquo;ll need to subscribe to keep going.</li>
          <li><b>Monthly</b>: a fresh allowance lands on your billing date every month. Anything left over from the previous month is gone — credits don&rsquo;t roll over.</li>
          <li><b>Yearly</b>: your full year of credits arrives the day you subscribe. Use them at your own pace, anytime within the year.</li>
        </ul>
      </>
    ),
  },
  {
    q: 'Is yearly billing worth it?',
    a: (
      <>
        <p>If you&rsquo;ll be using BuzzVideo for more than ~8 months, yes — yearly pays for itself and then some. Here&rsquo;s what you get versus paying month by month:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li><b>You pay ~30% less.</b> Twelve months of yearly costs about the same as 8.4 months of monthly.</li>
          <li><b>You get all your credits on day one.</b> Burn through them in a big campaign push, save them for later, or pace them across the year — it&rsquo;s your call.</li>
          <li><b>One charge, one invoice</b> — easier on accounting if you&rsquo;re expensing this.</li>
        </ul>
        <p className="mt-2">Not sure yet? Start on monthly — you can switch to yearly anytime to lock in the savings.</p>
      </>
    ),
  },
  {
    q: 'What happens if I run out of credits?',
    a: (
      <>
        <p>It depends on your plan:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li><b>Free users</b>: subscribe to a paid plan (Starter / Pro / Ultra) to unlock more credits and premium models.</li>
          <li><b>Starter / Pro</b>: upgrade to a higher plan at any time to add more credits immediately (remaining credits from your current plan are preserved — see the upgrade FAQ).</li>
          <li><b>Ultra</b>: scale up your Ultra credit tier using the slider on the Ultra plan card (2× or 4× the base credits, with a bulk discount), or wait until your next renewal.</li>
        </ul>
      </>
    ),
  },
  {
    q: 'Can I get more credits on Ultra?',
    a: (
      <>
        <p>Yes — drag the slider on the Ultra plan card to bump your credits up. The more you buy, the cheaper each credit gets:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li><b>1×</b> — base credits, regular price.</li>
          <li><b>2×</b> — double the credits, <b>5% off</b> per credit.</li>
          <li><b>4×</b> — quadruple the credits, <b>15% off</b> per credit.</li>
        </ul>
        <p className="mt-2">Starter and Pro don&rsquo;t have a slider (fixed price). If Pro&rsquo;s credits aren&rsquo;t enough, jumping to Ultra and sliding up will usually cost less than running out of credits mid-month.</p>
      </>
    ),
  },
  {
    q: 'Can I cancel anytime? Am I locked in?',
    a: (
      <>
        <p><b>No long-term commitment.</b> You can cancel anytime from your account settings, with no cancellation fee and no questions asked.</p>
        <p className="mt-2">After you cancel, you&rsquo;ll keep full access to your plan&rsquo;s benefits and remaining credits until the end of your current billing period, then automatically move to the Free plan — no service interruption.</p>
      </>
    ),
  },
  {
    q: 'Which AI models are included with my plan?',
    a: (
      <>
        <p>All paid plans include access to premium models. Each generation simply consumes credits from your plan&rsquo;s allowance.</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li><b>Free</b>: Seedream 4.5 and Seedream 5.0 Lite only (images), 500 one-time credits.</li>
          <li><b>Starter</b>: All image models + all video models <i>except</i> Seedance 2.0.</li>
          <li><b>Pro</b>: All image and video models, including Seedance 2.0.</li>
          <li><b>Ultra</b>: All models + Long Video Generation (Early Access) + priority processing.</li>
        </ul>
        <p className="mt-2">If you need Seedance 2.0 for the highest-fidelity video output, upgrade to Pro or Ultra.</p>
      </>
    ),
  },
  {
    q: 'Which models should I use — Standard or Premium Cinematic?',
    a: (
      <>
        <p>It depends on what you&rsquo;re making:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li>Use <b>Standard Assets</b> for the bread-and-butter work — routine product shots, social posts, A/B test variants, quick iterations. Cheaper per generation, totally fine quality for most ads.</li>
          <li>Use <b>Premium Cinematic Assets</b> when you&rsquo;re shooting a hero — flagship ad, brand campaign key visual, anything that needs to look like real cinematography. Costs more credits per generation, but the quality jump is huge.</li>
        </ul>
        <p className="mt-2">Most marketers mix both: Standard for volume, Premium Cinematic for the one or two shots that matter most. Both are available on any paid plan — except Seedance 2.0, which needs Pro or Ultra.</p>
      </>
    ),
  },
  {
    q: 'What are AI Avatars?',
    a: (
      <>
        <p>AI Avatars are <b>reusable generated characters</b> you can drop into image or video ads — useful for maintaining a consistent brand spokesperson, talent, or product model across campaigns without paying for repeat shoots.</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li><b>Free</b>: up to 10 avatars.</li>
          <li><b>Starter / Pro / Ultra</b>: unlimited avatars.</li>
        </ul>
        <p className="mt-2">Avatars work with Character Customization (Seedance 2.0 on Pro and Ultra) for dynamic motion and expressions.</p>
      </>
    ),
  },
  {
    q: 'What is Long Video Generation (Early Access)?',
    a: (
      <p>An <b>Ultra-exclusive feature</b> that lets you generate longer-form videos beyond the standard 5–10s clip length. Useful for product explainer videos, longer storytelling ads, and content for platforms like YouTube. As an Early Access feature, capabilities and limits will evolve — your feedback shapes the release.</p>
    ),
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: (
      <>
        <p>Yes — both are supported.</p>
        <p className="mt-3"><b>Upgrade</b> takes effect immediately:</p>
        <ul className="mt-1 pl-5 list-disc space-y-1">
          <li>The new plan activates the moment you upgrade.</li>
          <li>You&rsquo;re charged a <b>prorated amount immediately</b> — the difference between your current plan and the new plan, scaled to the days remaining in your current cycle. Your renewal date doesn&rsquo;t change.</li>
          <li>Any <b>remaining credits</b> from your previous plan are <b>preserved</b> and added to your new plan&rsquo;s allowance.</li>
        </ul>
        <p className="mt-3"><b>Downgrade</b> takes effect at the end of your current billing period:</p>
        <ul className="mt-1 pl-5 list-disc space-y-1">
          <li>Nothing changes right away — you keep your current plan&rsquo;s full benefits and credits until the cycle ends.</li>
          <li>On your renewal date, the new (lower) plan&rsquo;s price is charged and its credits are issued.</li>
          <li>Any unused credits from the previous cycle are forfeited at renewal (credits don&rsquo;t roll over).</li>
        </ul>
        <p className="mt-3 text-neutral-500">When you schedule an upgrade or downgrade, you&rsquo;ll see a confirmation showing the exact amount and date before you confirm.</p>
      </>
    ),
  },
  {
    q: 'Do you offer refunds?',
    a: (
      <>
        <p>We don&rsquo;t offer routine refunds — but you&rsquo;re never locked in. You can <b>cancel anytime</b> and you&rsquo;ll keep your remaining credits and full plan access through the end of your current billing period.</p>
        <p className="mt-2">In cases required by law or in special circumstances reviewed and approved by our platform, refunds may be considered. To request a review, contact our support team at <a href="mailto:info@presslogic.com" className="underline">info@presslogic.com</a>.</p>
        <p className="mt-2 text-neutral-500">If a refund is approved for an order that includes already-used benefits or credits, the final refund amount may be adjusted based on actual usage, subject to our review.</p>
      </>
    ),
  },
  {
    q: 'Can I use BuzzVideo-generated content commercially?',
    a: <p>Yes. <b>All plans, including Free</b>, include commercial use rights for content you generate in BuzzVideo. You can use the output for ads, social media posts, product images, video content, and any other business use case.</p>,
  },
  {
    q: 'Who owns the content I generate? Can I use it for client work?',
    a: (
      <>
        <p>You own <b>100% of the content</b> you generate in BuzzVideo — every image, video, and avatar. There are no royalties, no per-use fees, and no extra licensing.</p>
        <p className="mt-2">You can use generated assets for:</p>
        <ul className="mt-1 pl-5 list-disc space-y-1">
          <li>Your own brand&rsquo;s ads, social, web, and print</li>
          <li><b>Paid client work and agency deliverables</b> — including white-labeled handoffs to your clients</li>
          <li>Resale as stock or templates (as long as the prompts you used don&rsquo;t violate our content policy)</li>
        </ul>
        <p className="mt-2 text-neutral-500">Note: you&rsquo;re responsible for ensuring your prompts don&rsquo;t infringe third-party trademarks or include real people&rsquo;s likeness without their consent.</p>
      </>
    ),
  },
  {
    q: 'Is my data and prompts private? Will they be used to train AI?',
    a: (
      <>
        <p>Yes — your prompts, uploads, and generated outputs are <b>private to your account</b>. Specifically:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li>We do <b>not</b> use your content or prompts to train our AI models.</li>
          <li>We do <b>not</b> share your data with third parties for marketing or analytics.</li>
          <li>Generated outputs are stored only in your account workspace, accessible only to you.</li>
        </ul>
        <p className="mt-2">For Enterprise customers, we offer additional protections including <b>data residency</b>, <b>SOC 2 reports</b>, and a custom DPA. Contact sales via the Enterprise option for details.</p>
      </>
    ),
  },
  {
    q: 'Do you have an API?',
    a: (
      <>
        <p>Yes — API access is available on <b>Enterprise plans</b>. The API lets you integrate BuzzVideo generation directly into your existing workflows:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li>Shopify product pages and ecommerce CMS</li>
          <li>Internal content / creative pipelines</li>
          <li>Agency client portals (white-label generation)</li>
          <li>Marketing automation tools (e.g., HubSpot, Braze)</li>
        </ul>
        <p className="mt-2">To request early API access or discuss your use case, contact sales via the Enterprise option above.</p>
      </>
    ),
  },
  {
    q: 'Can I share my plan with my team?',
    a: (
      <>
        <p>Not on Starter, Pro, or Ultra — each of those is built for one person. If multiple teammates need their own logins, you have two options today:</p>
        <ul className="mt-2 pl-5 list-disc space-y-1">
          <li>Each person buys their own subscription.</li>
          <li>Talk to us about <b>Enterprise</b> — that&rsquo;s where multi-user access, seat management, and shared workspaces live.</li>
        </ul>
        <p className="mt-2">Native team features on the standard paid plans are on our roadmap — let us know if that&rsquo;s a dealbreaker for you and we&rsquo;ll factor it into priority.</p>
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="mt-20 max-w-3xl mx-auto">
      <h2 className="text-center text-2xl sm:text-[28px] font-bold tracking-tight mb-8">Frequently Asked Questions</h2>
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
        className="w-full flex justify-between items-center gap-4 py-[18px] text-left text-base font-medium"
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
