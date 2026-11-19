/**
 * Creates the first admin user and starter content.
 * Safe to run more than once: content is only added to empty tables,
 * and an existing admin's password is never overwritten.
 *
 *   npm run db:seed
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const practiceAreas = [
  {
    title: "Civil Litigation",
    slug: "civil-litigation",
    icon: "scale",
    summary: "Representation in civil suits, injunctions, recovery claims, contract disputes and appeals before civil courts.",
    body: `## Resolving disputes effectively

Civil disputes can be stressful, costly and time-consuming. We help clients assess the strength of their position early, explore settlement where it makes sense, and litigate firmly where it does not.

## How we help

- Filing and defending civil suits
- Applications for temporary and permanent injunctions
- Recovery of money and damages claims
- Breach of contract disputes
- Declaratory suits and specific performance
- Appeals and revisions before higher courts

## Our approach

Every matter begins with a careful review of your documents and a frank assessment of the options available. We then agree a clear strategy and keep you informed at every stage — from pleadings and evidence to final arguments.`,
  },
  {
    title: "Criminal Law",
    slug: "criminal-law",
    icon: "shield",
    summary: "Defence in criminal proceedings, bail matters, trials and appeals — protecting your rights from the first step.",
    body: `## Protecting your rights

If you or a family member is facing a criminal allegation, early legal advice can make a decisive difference. We act quickly to protect your rights and build a strong defence.

## How we help

- Pre-arrest and post-arrest bail
- Defence at trial
- Quashing of proceedings where appropriate
- Appeals against conviction and sentence
- Representation of complainants

## What to do now

Do not make statements without legal advice. Keep copies of all documents you receive and contact us as soon as possible so we can advise on the next steps.`,
  },
  {
    title: "Family Law",
    slug: "family-law",
    icon: "family",
    summary: "Sensitive, confidential advice on divorce, child custody, maintenance, dowry and guardianship matters.",
    body: `## Compassionate, confidential advice

Family matters are deeply personal. We combine sensitivity with firm advocacy to protect your interests and, above all, the welfare of your children.

## How we help

- Divorce and dissolution of marriage
- Child custody and visitation
- Maintenance for spouse and children
- Recovery of dowry articles
- Guardianship matters
- Mediation and settlement agreements

## A practical approach

Wherever possible we seek respectful, negotiated outcomes that reduce conflict and cost. When court proceedings are necessary, we represent you with care and determination.`,
  },
  {
    title: "Property & Real Estate",
    slug: "property-law",
    icon: "home",
    summary: "Title verification, sale and purchase documentation, possession disputes, partition and inheritance claims.",
    body: `## Secure your property and investment

Property is often a family's most valuable asset. We help clients buy, sell and protect property with confidence, and resolve disputes when they arise.

## How we help

- Title verification and due diligence before purchase
- Drafting and reviewing sale agreements and transfer documents
- Possession and ejectment suits
- Partition and inheritance claims
- Landlord and tenant disputes
- Challenges to fraudulent transfers

## Before you buy

A careful title check before signing can prevent years of litigation. Contact us to review the documents before you make any payment.`,
  },
  {
    title: "Corporate & Commercial",
    slug: "corporate-commercial",
    icon: "briefcase",
    summary: "Company formation, contracts, compliance and commercial disputes for businesses of every size.",
    body: `## Legal support for growing businesses

From formation to day-to-day contracts and disputes, we give businesses practical legal advice that supports their commercial goals.

## How we help

- Company and partnership formation
- Drafting and reviewing commercial contracts
- Shareholder and partnership agreements
- Regulatory and corporate compliance
- Commercial dispute resolution and recovery

## Prevention first

Well-drafted agreements prevent most commercial disputes. We help you put clear terms in writing so that your business is protected.`,
  },
  {
    title: "Banking & Recovery",
    slug: "banking-recovery",
    icon: "bank",
    summary: "Recovery suits, cheque dishonour matters and banking disputes for individuals, businesses and institutions.",
    body: `## Recovering what you are owed

We act for creditors and borrowers in recovery and banking matters, aiming for efficient resolution through negotiation or the courts.

## How we help

- Recovery suits and summary proceedings
- Dishonoured cheque matters
- Defending recovery claims
- Loan and finance documentation review
- Settlement negotiations

## Act promptly

Recovery claims are subject to time limits. Speak to us early to protect your position.`,
  },
];

const faqs = [
  {
    question: "How do I book a consultation?",
    answer: "Use the contact form on this website, call our office, or send us a WhatsApp message. We will confirm a convenient time for an in-person or phone consultation.",
  },
  {
    question: "What should I bring to my first meeting?",
    answer: "Bring a copy of your identity document and every document related to your matter — agreements, notices, court papers, receipts and correspondence. A short written timeline of events is also very helpful.",
  },
  {
    question: "How are your fees calculated?",
    answer: "Fees depend on the nature and complexity of the matter. After the initial consultation we explain the fee structure clearly and agree it in writing before any work begins.",
  },
  {
    question: "Is what I tell you confidential?",
    answer: "Yes. Everything you share with us is protected by lawyer–client confidentiality and handled with complete discretion.",
  },
  {
    question: "How long will my case take?",
    answer: "Timelines vary depending on the type of case, the court and the conduct of the other party. We give you a realistic estimate at the outset and keep you updated as the matter progresses.",
  },
];

const posts = [
  {
    title: "How to Prepare for Your First Meeting With a Lawyer",
    slug: "prepare-for-first-meeting-with-a-lawyer",
    excerpt: "A little preparation helps your lawyer understand your situation quickly and give you clearer advice. Here is what to bring and what to ask.",
    body: `Your first consultation is the foundation of your case. Being well prepared saves time and helps your lawyer give you accurate, practical advice.

## 1. Gather your documents

Bring every document connected to the matter, even if you are unsure it is relevant:

- Agreements, contracts and receipts
- Notices or letters you have received
- Court papers, if proceedings have started
- Messages and emails with the other party

## 2. Write a short timeline

List the key events in date order. A one-page summary helps your lawyer understand the facts quickly and spot important deadlines.

## 3. Prepare your questions

Useful questions include:

- What are my options?
- What are the risks and likely costs of each option?
- How long is the process likely to take?
- What do you need from me next?

## 4. Be completely honest

Your conversation is confidential. Your lawyer can only protect you properly if they know all the facts — including the unfavourable ones.

> Good preparation turns a first meeting into a clear plan of action.

If you would like to discuss your matter, contact us to arrange a consultation.`,
  },
  {
    title: "Why You Should Have a Contract Reviewed Before Signing",
    slug: "review-contract-before-signing",
    excerpt: "Signing first and reading later is one of the most common causes of disputes. A short legal review can protect you from costly surprises.",
    body: `Contracts define your rights and obligations. Once signed, they can be difficult and expensive to change.

## Common problems we see

- **Unclear payment terms** that lead to disputes about what is owed and when
- **One-sided termination clauses** that let the other party walk away easily
- **Missing timelines** for delivery or possession
- **Penalty clauses** that are far heavier on one side
- **No dispute resolution clause**, leaving every disagreement to the courts

## What a review covers

A legal review checks that the agreement reflects what you actually agreed, that your interests are protected, and that the document is enforceable.

## When to ask for a review

Ask for a review before you sign any agreement involving significant money, property, employment or a long-term commitment.

A small investment in advice today can prevent a lengthy dispute tomorrow.`,
  },
];

async function main() {
  // Admin user
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || password.length < 10) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (min 10 chars) in .env before seeding.");
  }
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists — password left unchanged.`);
  } else {
    await db.adminUser.create({ data: { email, name: "Administrator", passwordHash: await bcrypt.hash(password, 12) } });
    console.log(`Created admin ${email}`);
  }

  // Site settings (only fill content fields that are still empty)
  const s = await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  if (!s.heroTitle) {
    await db.siteSettings.update({
      where: { id: 1 },
      data: {
        firmName: "Adam Law Chamber",
        tagline: "Advocates & Legal Consultants",
        heroEyebrow: "Advocates & Legal Consultants",
        heroTitle: "Trusted legal counsel when it matters most",
        heroSubtitle:
          "Clear advice and determined representation in civil, criminal, family, property and corporate matters. Speak with an experienced advocate today.",
        aboutTitle: "Committed to protecting your rights",
        aboutBody: `Adam Law Chamber provides dependable legal advice and representation to individuals, families and businesses.

We believe good legal service starts with listening. We take time to understand your situation, explain your options in plain language, and build a clear strategy to achieve the best possible outcome.

Whether you need advice before signing an agreement, help resolving a dispute, or strong representation in court, you can rely on us to handle your matter with diligence, integrity and complete confidentiality.`,
        ctaTitle: "Need legal advice? Let's talk.",
        ctaText: "Book a confidential consultation and get clear guidance on your next steps.",
        footerText: "Dependable legal advice and representation for individuals, families and businesses.",
        seoTitle: "Adam Law Chamber | Advocates & Legal Consultants",
        seoDescription:
          "Adam Law Chamber offers trusted legal advice and court representation in civil, criminal, family, property and corporate matters. Book a confidential consultation.",
        seoKeywords: "lawyer, advocate, law firm, legal consultant, family lawyer, criminal lawyer, property lawyer, civil lawyer",
      },
    });
    console.log("Added starter home/about content and SEO defaults");
  }

  if ((await db.practiceArea.count()) === 0) {
    for (const [i, a] of practiceAreas.entries()) await db.practiceArea.create({ data: { ...a, sortOrder: i } });
    console.log(`Added ${practiceAreas.length} practice areas`);
  }
  if ((await db.faq.count()) === 0) {
    for (const [i, f] of faqs.entries()) await db.faq.create({ data: { ...f, sortOrder: i } });
    console.log(`Added ${faqs.length} FAQs`);
  }
  if ((await db.post.count()) === 0) {
    for (const [i, p] of posts.entries()) {
      await db.post.create({
        data: { ...p, published: true, publishedAt: new Date(Date.now() - (i + 1) * 7 * 86400000) },
      });
    }
    console.log(`Added ${posts.length} articles`);
  }
  if ((await db.teamMember.count()) === 0) {
    await db.teamMember.create({
      data: {
        name: "Adam",
        role: "Founding Advocate",
        bio: "Replace this with the advocate's profile: education, bar enrolment, courts of practice, years of experience and areas of focus.",
        sortOrder: 0,
      },
    });
    console.log("Added placeholder team member");
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
