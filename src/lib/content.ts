/**
 * Editable page text and sections (Admin → Pages & sections).
 *
 * DEFAULTS holds the built-in wording; anything saved in the admin panel (PageContent table,
 * one JSON row per section) overrides it field by field. PAGES describes how the admin form
 * is laid out. This file has no server imports so the client-side header can use its types.
 */

export type Item = Record<string, string>;
type Value = string | boolean | Item[];

const DEFAULTS_RAW = {
  /* ───────── Home page ───────── */
  "home.hero": {
    primaryButton: "Book a Free Consultation",
    secondaryButton: "Our Practice Areas",
    checks: [{ text: "Strictly confidential" }, { text: "Clear, agreed fees" }, { text: "Personal attention" }],
    badgeTitle: "100% Confidential",
    badgeText: "Every enquiry, every case",
  },
  "home.pillars": {
    show: true,
    items: [
      { icon: "users", title: "Personal attention", text: "You work directly with an experienced advocate, not a call centre." },
      { icon: "document", title: "Clear, honest advice", text: "Your options and likely outcomes, explained in plain language." },
      { icon: "briefcase", title: "Transparent fees", text: "Fees agreed in writing before work begins — no surprises." },
      { icon: "shield", title: "Strategic representation", text: "A clear plan, careful preparation and strong advocacy." },
    ],
  },
  "home.practice": {
    show: true,
    eyebrow: "Practice Areas",
    title: "Legal expertise *you can rely on*",
    intro: "Focused, practical representation across the matters that affect individuals, families and businesses.",
    linkLabel: "View all practice areas",
  },
  "home.about": {
    show: true,
    eyebrow: "About the Chamber",
    quote: "Your rights. Our commitment.",
    primaryButton: "More about us",
    secondaryLink: "Meet the team",
  },
  "home.process": {
    show: true,
    eyebrow: "How We Work",
    title: "A clear path from *first call to resolution*",
    intro: "No jargon and no surprises — just a straightforward process built around you.",
    steps: [
      { title: "Consultation", text: "Tell us about your situation in a confidential first meeting — in person, by phone or online." },
      { title: "Assessment", text: "We review your documents, explain your rights and set out the realistic options." },
      { title: "Strategy & action", text: "An agreed plan and fee, then careful preparation, negotiation and representation." },
      { title: "Resolution", text: "We keep you informed at every stage until your matter is resolved." },
    ],
  },
  "home.testimonials": {
    show: true,
    eyebrow: "Client Testimonials",
    title: "What our *clients say*",
  },
  "home.faq": {
    show: true,
    eyebrow: "FAQ",
    title: "Common *questions*",
    intro: "Answers to questions clients often ask before their first consultation.",
    boxTitle: "Still have a question?",
    boxText: "Speak to us directly — the first conversation is free and confidential.",
    primaryButton: "Ask us",
    secondaryButton: "All FAQs",
  },
  "home.posts": {
    show: true,
    eyebrow: "Legal Insights",
    title: "Latest *articles*",
    linkLabel: "All articles",
  },

  /* ───────── About page ───────── */
  "about.page": {
    metaTitle: "About Us",
    metaDescription: "",
    eyebrow: "About Us",
    title: "",
    intro: "",
  },
  "about.story": {
    eyebrow: "Who We Are",
    primaryButton: "Book a Consultation",
    secondaryLink: "Meet the team",
    adviseTitle: "We advise on",
  },
  "about.values": {
    show: true,
    eyebrow: "Our Values",
    title: "The principles *behind our practice*",
    items: [
      { icon: "scale", title: "Integrity", text: "Honest advice, even when it is not what you hoped to hear." },
      { icon: "shield", title: "Confidentiality", text: "Your information is protected with the utmost discretion." },
      { icon: "document", title: "Diligence", text: "Thorough preparation for every hearing, filing and negotiation." },
      { icon: "users", title: "Accessibility", text: "Clear communication and prompt updates throughout your matter." },
    ],
  },

  /* ───────── Practice areas ───────── */
  "practice.page": {
    metaTitle: "Practice Areas",
    metaDescription: "",
    eyebrow: "Practice Areas",
    title: "How we can help",
    intro: "Experienced counsel and representation across a wide range of legal matters.",
    emptyText: "Practice areas will be listed here soon.",
  },
  "practice.detail": {
    eyebrow: "Practice Area",
    helpTitle: "Need help with {area}?",
    helpText: "Tell us about your situation and we will advise on the best way forward.",
    helpButton: "Request a Consultation",
    otherTitle: "Other practice areas",
  },

  /* ───────── Team ───────── */
  "team.page": {
    metaTitle: "Our Team",
    metaDescription: "",
    eyebrow: "Our Team",
    title: "The people behind your case",
    intro: "Dedicated legal professionals committed to protecting your interests.",
    emptyText: "Team profiles coming soon.",
  },

  /* ───────── Blog ───────── */
  "blog.page": {
    metaTitle: "Legal Insights",
    metaDescription: "",
    eyebrow: "Legal Insights",
    title: "Articles & guidance",
    intro: "Practical explanations of legal issues that matter to individuals, families and businesses.",
    emptyText: "Articles are coming soon.",
  },
  "blog.post": {
    adviceTitle: "Need advice on your specific situation?",
    adviceText: "This article is general information, not legal advice. Contact us to discuss your circumstances.",
    adviceButton: "Book a Consultation",
    moreEyebrow: "Keep Reading",
    moreTitle: "More *insights*",
  },

  /* ───────── FAQ ───────── */
  "faq.page": {
    metaTitle: "Frequently Asked Questions",
    metaDescription: "",
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    intro: "If your question is not answered here, contact us and we will be glad to help.",
    emptyText: "Questions will be added soon.",
  },

  /* ───────── Contact ───────── */
  "contact.page": {
    metaTitle: "Contact Us",
    metaDescription: "",
    eyebrow: "Contact",
    title: "Book a consultation",
    intro: "Tell us briefly about your matter. All enquiries are treated in strict confidence.",
  },
  "contact.panel": {
    eyebrow: "Get in Touch",
    title: "We're here *to help*",
    text: "Reach us by phone, WhatsApp or email, or send the form and we will respond promptly.",
    nextTitle: "What happens next",
    steps: [
      { text: "We review your enquiry in strict confidence." },
      { text: "We contact you to arrange a consultation." },
      { text: "You receive clear advice on your options and fees." },
    ],
  },
  "contact.form": {
    title: "Send us a message",
    intro: "Tell us briefly about your matter — it takes less than two minutes.",
    nameLabel: "Full name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    areaLabel: "Legal matter",
    areaPlaceholder: "Select an area (optional)",
    messageLabel: "How can we help?",
    button: "Send Message",
    sending: "Sending…",
    privacyNote: "Your information is kept strictly confidential.",
    successTitle: "Thank you — message received",
    successText: "We will review your enquiry and get back to you as soon as possible.",
  },

  /* ───────── Header & menus ───────── */
  "header.nav": {
    about: "About",
    practice: "Practice Areas",
    insights: "Insights",
    contact: "Contact",
    button: "Free Consultation",
    mobileButton: "Book a Free Consultation",
  },
  "header.aboutMenu": {
    eyebrow: "About Us",
    title: "Committed to *your rights.*",
    intro: "A client-focused chamber offering dependable advice and strong representation.",
    viewAll: "More about the chamber",
    heading: "Get to know us",
    helpText: "Have a question about working with us?",
    helpLink: "Read the FAQ",
    links: [
      { icon: "scale", title: "About the Chamber", text: "Our story, values and approach" },
      { icon: "users", title: "Our Team", text: "The advocates behind your case" },
      { icon: "document", title: "FAQ", text: "Answers before you call" },
      { icon: "building", title: "Contact & Office", text: "Visit, call or send us a message" },
    ],
  },
  "header.practiceMenu": {
    eyebrow: "Practice Areas",
    title: "Clear advice, *every matter.*",
    intro: "Advice and representation for individuals, families and businesses — from first consultation to final hearing.",
    viewAll: "View all practice areas",
    heading: "How we can help",
    helpText: "Not sure which area fits your matter?",
    helpLink: "Speak to a lawyer",
  },
  "header.insightsMenu": {
    eyebrow: "Legal Insights",
    title: "Know where *you stand.*",
    intro: "Practical guides that explain legal issues in plain language.",
    viewAll: "Browse all articles",
    heading: "Latest articles",
    helpText: "Need advice on your own situation?",
    helpLink: "Speak to a lawyer",
    allTitle: "All articles",
    allText: "Browse every guide and update",
  },
  "header.consultCard": {
    eyebrow: "First step",
    title: "Free first consultation",
    stat1Value: "100%",
    stat1Label: "Confidential",
    stat2Value: "1-to-1",
    stat2Label: "With an advocate",
    button: "Book now",
  },

  /* ───────── Footer ───────── */
  "footer.main": {
    practiceHeading: "Practice Areas",
    linksHeading: "Quick Links",
    links: [
      { label: "About Us" },
      { label: "Our Team" },
      { label: "Legal Insights" },
      { label: "FAQ" },
      { label: "Contact" },
    ],
    contactHeading: "Get in Touch",
    consultTitle: "Free first consultation",
    consultText: "Confidential advice on your next steps.",
    consultLink: "Book now",
    copyright: "All rights reserved.",
    disclaimer: "The information on this website is for general guidance only and is not legal advice.",
  },

  /* ───────── Shared ───────── */
  "shared.cta": {
    eyebrow: "Confidential Consultation",
    button: "Book a Consultation",
    whatsappLabel: "WhatsApp us",
    cardLink: "Learn more",
    whatsappMessage: "Hello {firm}, I would like to discuss a legal matter.",
  },
} satisfies Record<string, Record<string, Value>>;

export type Content = typeof DEFAULTS_RAW;
export type SectionKey = keyof Content;
export const DEFAULTS: Content = DEFAULTS_RAW;

/* ───────── Admin form layout ───────── */

export type ItemFieldDef = { key: string; label: string; type: "text" | "textarea" | "icon" };
export type FieldDef = {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "textarea" | "toggle" | "list";
  /** Empty value falls back to the default instead of hiding the text. */
  required?: boolean;
  /** list: the fields of one item */
  item?: ItemFieldDef[];
  /** list: fixed items (no add/remove); labels name each one */
  fixedLabels?: string[];
  max?: number;
};
export type SectionDef = { key: SectionKey; title: string; description?: string; fields: FieldDef[] };
export type PageDef = { id: string; label: string; description: string; sections: SectionDef[] };

const STAR = "Wrap words in *asterisks* to show them in gold italics.";
const txt = (key: string, label: string, opts: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: "text", ...opts });
const area = (key: string, label: string, opts: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: "textarea", ...opts });
const show = (label = "Show this section"): FieldDef => ({ key: "show", label, type: "toggle" });
const heading = (opts: { intro?: boolean } = {}): FieldDef[] => [
  txt("eyebrow", "Small heading"),
  txt("title", "Heading", { hint: STAR, required: true }),
  ...(opts.intro ? [area("intro", "Introduction")] : []),
];
const pageBanner = (titleHint?: string): FieldDef[] => [
  txt("eyebrow", "Small heading"),
  txt("title", "Page title", { hint: titleHint ?? STAR, required: !titleHint }),
  area("intro", "Introduction"),
  txt("metaTitle", "Browser tab / Google title", { required: true, hint: "Shown in search results as “Title | Firm name”." }),
  area("metaDescription", "Google description", { hint: "140–160 characters. Leave empty to use an automatic description." }),
];
const iconCards: ItemFieldDef[] = [
  { key: "icon", label: "Icon", type: "icon" },
  { key: "title", label: "Title", type: "text" },
  { key: "text", label: "Text", type: "textarea" },
];
const menuIntro: FieldDef[] = [
  txt("eyebrow", "Small heading"),
  txt("title", "Heading", { hint: STAR, required: true }),
  area("intro", "Introduction"),
  txt("viewAll", "Link under the introduction", { required: true }),
  txt("heading", "Heading above the links"),
  txt("helpText", "Help bar text"),
  txt("helpLink", "Help bar link"),
];

export const PAGES: PageDef[] = [
  {
    id: "home",
    label: "Home",
    description:
      "Every section of the home page. The main banner heading, about text and figures are under Home & About page.",
    sections: [
      {
        key: "home.hero",
        title: "Banner buttons & badges",
        fields: [
          txt("primaryButton", "Main button", { required: true }),
          txt("secondaryButton", "Second button", { hint: "Shown when no phone number is set; otherwise the phone number is shown." }),
          { key: "checks", label: "Ticks under the buttons", type: "list", item: [{ key: "text", label: "Text", type: "text" }], max: 4 },
          txt("badgeTitle", "Floating badge — title"),
          txt("badgeText", "Floating badge — text"),
        ],
      },
      {
        key: "home.pillars",
        title: "“Why choose us” boxes",
        description: "The white strip of boxes just under the banner.",
        fields: [show(), { key: "items", label: "Boxes", type: "list", item: iconCards, max: 4 }],
      },
      {
        key: "home.practice",
        title: "Practice areas section",
        description: "The practice areas themselves are edited under Practice areas.",
        fields: [show(), ...heading({ intro: true }), txt("linkLabel", "Link text", { required: true })],
      },
      {
        key: "home.about",
        title: "About section",
        description: "The heading, text, image and figures are edited under Home & About page.",
        fields: [
          show(),
          txt("eyebrow", "Small heading"),
          txt("quote", "Quote on the image"),
          txt("primaryButton", "Button", { required: true }),
          txt("secondaryLink", "Link", { required: true }),
        ],
      },
      {
        key: "home.process",
        title: "“How we work” steps",
        fields: [
          show(),
          ...heading({ intro: true }),
          {
            key: "steps",
            label: "Steps",
            type: "list",
            item: [
              { key: "title", label: "Title", type: "text" },
              { key: "text", label: "Text", type: "textarea" },
            ],
            max: 6,
          },
        ],
      },
      {
        key: "home.testimonials",
        title: "Testimonials section",
        description: "The testimonials themselves are edited under Testimonials.",
        fields: [show(), ...heading()],
      },
      {
        key: "home.faq",
        title: "FAQ section",
        description: "The questions themselves are edited under FAQs.",
        fields: [
          show(),
          ...heading({ intro: true }),
          txt("boxTitle", "Contact box — title"),
          area("boxText", "Contact box — text"),
          txt("primaryButton", "Contact box — main button", { required: true }),
          txt("secondaryButton", "Contact box — second button", { required: true }),
        ],
      },
      {
        key: "home.posts",
        title: "Latest articles section",
        fields: [show(), ...heading(), txt("linkLabel", "Link text", { required: true })],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    description: "The About page. The main about text and image are under Home & About page.",
    sections: [
      { key: "about.page", title: "Page banner & Google", fields: pageBanner("Leave empty to use the About heading from Home & About page.") },
      {
        key: "about.story",
        title: "Main section",
        fields: [
          txt("eyebrow", "Small heading"),
          txt("primaryButton", "Button", { required: true }),
          txt("secondaryLink", "Link", { required: true }),
          txt("adviseTitle", "Heading of the practice areas box"),
        ],
      },
      {
        key: "about.values",
        title: "Values",
        fields: [show(), ...heading(), { key: "items", label: "Values", type: "list", item: iconCards, max: 8 }],
      },
    ],
  },
  {
    id: "practice",
    label: "Practice areas",
    description: "The practice areas list page and the text shown on every practice area page.",
    sections: [
      { key: "practice.page", title: "List page — banner & Google", fields: [...pageBanner(), txt("emptyText", "Text when there are none")] },
      {
        key: "practice.detail",
        title: "Each practice area page",
        fields: [
          txt("eyebrow", "Small heading"),
          txt("helpTitle", "Side box — heading", { hint: "{area} is replaced with the practice area name." }),
          area("helpText", "Side box — text"),
          txt("helpButton", "Side box — button", { required: true }),
          txt("otherTitle", "Heading of the other practice areas list"),
        ],
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    description: "The Our Team page. The people themselves are edited under Team.",
    sections: [{ key: "team.page", title: "Banner & Google", fields: [...pageBanner(), txt("emptyText", "Text when there are no profiles")] }],
  },
  {
    id: "blog",
    label: "Insights",
    description: "The articles list page and the text shown on every article.",
    sections: [
      { key: "blog.page", title: "List page — banner & Google", fields: [...pageBanner(), txt("emptyText", "Text when there are no articles")] },
      {
        key: "blog.post",
        title: "Each article",
        fields: [
          txt("adviceTitle", "Box after the article — heading"),
          area("adviceText", "Box after the article — text"),
          txt("adviceButton", "Box after the article — button", { required: true }),
          txt("moreEyebrow", "More articles — small heading"),
          txt("moreTitle", "More articles — heading", { hint: STAR, required: true }),
        ],
      },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    description: "The FAQ page. The questions themselves are edited under FAQs.",
    sections: [{ key: "faq.page", title: "Banner & Google", fields: [...pageBanner(), txt("emptyText", "Text when there are no questions")] }],
  },
  {
    id: "contact",
    label: "Contact",
    description: "The Contact page. Phone, email, address and map are under Firm details & SEO.",
    sections: [
      { key: "contact.page", title: "Banner & Google", fields: pageBanner() },
      {
        key: "contact.panel",
        title: "Dark contact panel",
        fields: [
          txt("eyebrow", "Small heading"),
          txt("title", "Heading", { hint: STAR, required: true }),
          area("text", "Text"),
          txt("nextTitle", "“What happens next” heading"),
          { key: "steps", label: "Next steps", type: "list", item: [{ key: "text", label: "Text", type: "text" }], max: 6 },
        ],
      },
      {
        key: "contact.form",
        title: "Contact form",
        fields: [
          txt("title", "Heading", { required: true }),
          area("intro", "Introduction"),
          txt("nameLabel", "Name label", { required: true }),
          txt("emailLabel", "Email label", { required: true }),
          txt("phoneLabel", "Phone label", { required: true }),
          txt("areaLabel", "Legal matter label", { required: true }),
          txt("areaPlaceholder", "Legal matter — empty choice", { required: true }),
          txt("messageLabel", "Message label", { required: true }),
          txt("button", "Send button", { required: true }),
          txt("sending", "Send button while sending", { required: true }),
          txt("privacyNote", "Note next to the button"),
          txt("successTitle", "After sending — heading", { required: true }),
          area("successText", "After sending — text"),
        ],
      },
    ],
  },
  {
    id: "menu",
    label: "Menu",
    description: "The top menu and its drop-down panels on every page.",
    sections: [
      {
        key: "header.nav",
        title: "Menu items & button",
        fields: [
          txt("about", "About menu", { required: true }),
          txt("practice", "Practice areas menu", { required: true }),
          txt("insights", "Insights menu", { required: true }),
          txt("contact", "Contact link", { required: true }),
          txt("button", "Gold button", { required: true }),
          txt("mobileButton", "Button in the phone menu", { required: true }),
        ],
      },
      {
        key: "header.aboutMenu",
        title: "About drop-down",
        fields: [
          ...menuIntro,
          {
            key: "links",
            label: "Links",
            type: "list",
            item: iconCards,
            fixedLabels: ["About page", "Team page", "FAQ page", "Contact page"],
          },
        ],
      },
      { key: "header.practiceMenu", title: "Practice areas drop-down", description: "Lists your practice areas automatically.", fields: menuIntro },
      {
        key: "header.insightsMenu",
        title: "Insights drop-down",
        description: "Lists your latest articles automatically.",
        fields: [...menuIntro, txt("allTitle", "“All articles” link — title", { required: true }), txt("allText", "“All articles” link — text")],
      },
      {
        key: "header.consultCard",
        title: "Consultation card in the drop-downs",
        fields: [
          txt("eyebrow", "Small heading"),
          txt("title", "Heading"),
          txt("stat1Value", "Figure 1"),
          txt("stat1Label", "Label 1"),
          txt("stat2Value", "Figure 2"),
          txt("stat2Label", "Label 2"),
          txt("button", "Button", { required: true }),
        ],
      },
    ],
  },
  {
    id: "footer",
    label: "Footer & shared",
    description: "The footer and the call-to-action band shown at the bottom of every page.",
    sections: [
      {
        key: "footer.main",
        title: "Footer",
        description: "Footer text, address and social links are under Firm details & SEO.",
        fields: [
          txt("practiceHeading", "Practice areas heading"),
          txt("linksHeading", "Quick links heading"),
          {
            key: "links",
            label: "Quick links",
            type: "list",
            item: [{ key: "label", label: "Text", type: "text" }],
            fixedLabels: ["About page", "Team page", "Insights page", "FAQ page", "Contact page"],
          },
          txt("contactHeading", "Contact heading"),
          txt("consultTitle", "Consultation box — heading"),
          txt("consultText", "Consultation box — text"),
          txt("consultLink", "Consultation box — link", { required: true }),
          txt("copyright", "Text after © year and firm name"),
          area("disclaimer", "Disclaimer"),
        ],
      },
      {
        key: "shared.cta",
        title: "Call-to-action band & buttons",
        description: "The band's heading and text are under Home & About page.",
        fields: [
          txt("eyebrow", "Band — small heading"),
          txt("button", "Band — main button", { required: true }),
          txt("whatsappLabel", "“WhatsApp us” text", { required: true }),
          txt("cardLink", "Practice area cards — link text", { required: true }),
          txt("whatsappMessage", "WhatsApp button — first message", { hint: "{firm} is replaced with the firm name." }),
        ],
      },
    ],
  },
];

const FIELD_INDEX = new Map<string, FieldDef>();
for (const p of PAGES) for (const s of p.sections) for (const f of s.fields) FIELD_INDEX.set(`${s.key}.${f.key}`, f);

const isItemList = (v: unknown): v is Item[] =>
  Array.isArray(v) && v.every((i) => i && typeof i === "object" && Object.values(i).every((x) => typeof x === "string"));

/**
 * Merges saved values over the defaults. Unknown or wrongly-typed values are ignored,
 * so a bad row can never break a page.
 */
export function mergeContent(saved: Record<string, unknown>): Content {
  const out: Record<string, Record<string, Value>> = {};
  for (const [section, defaults] of Object.entries(DEFAULTS) as [string, Record<string, Value>][]) {
    const stored = (saved[section] ?? {}) as Record<string, unknown>;
    const merged: Record<string, Value> = {};
    for (const [field, def] of Object.entries(defaults)) {
      const v = stored[field];
      const required = FIELD_INDEX.get(`${section}.${field}`)?.required;
      if (typeof def === "string") merged[field] = typeof v === "string" && (v.trim() || !required) ? v : def;
      else if (typeof def === "boolean") merged[field] = typeof v === "boolean" ? v : def;
      else if (isItemList(v)) {
        // Fixed lists keep their length; missing fields in items fall back to the default item.
        const fixed = FIELD_INDEX.get(`${section}.${field}`)?.fixedLabels;
        merged[field] = fixed ? def.map((d, i) => ({ ...d, ...(v[i] ?? {}) })) : v;
      } else merged[field] = def;
    }
    out[section] = merged;
  }
  return out as Content;
}

/** Replaces {name} placeholders, e.g. fill("Need help with {area}?", { area: "family law" }). */
export function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);
}
