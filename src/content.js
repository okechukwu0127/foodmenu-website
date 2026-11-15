// ─────────────────────────────────────────────────────────────────────────────
// ALL WEBSITE TEXT LIVES HERE. Edit any label and save - the page updates.
// A field written as { restaurant: '…', partner: '…' } changes with the
// "I run a restaurant" / "I want to earn" switch in the top bar.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: "Liberq",
  email: "hello@liberq.co.uk",
  year: 2026,
};

export const nav = {
  modes: {
    restaurant: { label: "I run a restaurant", hint: "Get your own app" },
    partner: { label: "I want to earn", hint: "Become a partner" },
  },
  beta: "Join the beta",
  cta: { restaurant: "Book a demo", partner: "Apply now" },
};

// Background looks behind the hero (shown under a dark veil). First visit = aurora.
export const looks = [
  {
    id: "aurora",
    name: "Aurora Glass",
    video: "/assets/video/heroC",
    poster: "/assets/img/heroC.jpg",
    swatch: "linear-gradient(160deg,#09090c,#d58af5,#f99a6d)",
  },
  {
    id: "dusk",
    name: "Chrome Dusk",
    video: "/assets/video/heroB",
    poster: "/assets/img/heroB.jpg",
    swatch: "linear-gradient(160deg,#06061a,#d42097,#ff752b)",
  },
  {
    id: "noir",
    name: "Noir Gel",
    video: "/assets/video/heroA",
    poster: "/assets/img/heroA.jpg",
    swatch: "linear-gradient(160deg,#05040f,#8b8cff,#ff90b4)",
  },
];

export const hero = {
  eyebrow: {
    restaurant: "For restaurant owners",
    partner: "For partners & marketers",
  },
  title: {
    restaurant: {
      lines: ["Your restaurant.", "Your app."],
      accent: "Your customers.",
    },
    partner: { lines: ["Sell the app."], accent: "Earn every month." },
  },
  lead: {
    restaurant:
      "Your own branded ordering app on iPhone, Android and the web - 0% commission on every order, with an AI waiter that takes orders for you.",
    partner:
      "Introduce local restaurants to Liberq. Earn a bonus when they go live, plus monthly commission while they grow. No fee to join.",
  },
  cta: { restaurant: "Book a free demo", partner: "Become a partner" },
  secondary: { restaurant: "See how it works", partner: "How partners earn" },
  ticks: {
    restaurant: [
      "0% order commission",
      "iOS, Android & QR web",
      "Stuart, Uber Direct or your drivers",
    ],
    partner: [
      "No fee to join",
      "£50–£125 go-live bonus",
      "20% monthly for 6 months",
    ],
  },
  // Phone screen recording (mp4 + webm with the same name)
  video: "/assets/video/app-demo",
  poster: "/assets/video/app-demo-poster.jpg",
  // Floating cards around the hero phone - they drift in and out one after another.
  cards: {
    restaurant: [
      { k: "Orders today", v: "86", note: "+£2,148 · no commission" },
      {
        k: "AI waiter",
        text: "“Pizza under £20?” -",
        strong: "3 picks found",
        lav: true,
      },
      { k: "New order #1043", v: "£18.50", note: "Paid with Apple Pay" },
    ],
    partner: [
      { k: "Go-live bonus", v: "+£100", note: "Burger Hub is live" },
      {
        k: "Your earnings",
        strong: "£254.80",
        text: "per Growth restaurant you sign",
        lav: true,
        strongFirst: true,
      },
      {
        k: "Next payout · 28 Nov",
        v: "£486",
        note: "3 restaurants this month",
      },
    ],
  },
  scroll: "Scroll",
};

export const partnersStrip = [
  "Works with",
  "Stuart",
  "Uber Direct",
  "Your own drivers",
  "Apple Pay",
  "Google Pay",
  "Stripe",
];

export const problem = {
  eyebrow: {
    restaurant: "Why restaurants switch",
    partner: "Your opening line",
  },
  title: {
    restaurant: ["Stop giving away £9", "of every £30 order."],
    partner: ["Show them the £9 they lose", "on every order."],
  },
  sub: {
    restaurant:
      "Marketplaces charge around 30% on delivered orders. With your own app, that money - and the customer - stay with you.",
    partner:
      "Every restaurant owner already feels the marketplace bite. You walk in with the fix - and the numbers to prove it.",
  },
  marketplace: {
    title: "Marketplace app",
    rows: [
      ["Order value", "£30.00"],
      ["Commission (~30%)", "−£9.00", "neg"],
      ["Customer data", "Theirs", "neg"],
    ],
    total: ["Restaurant keeps", "£21.00"],
  },
  liberq: {
    title: "Liberq app",
    rows: [
      ["Order value", "£30.00"],
      ["Commission", "£0.00", "pos"],
      ["Customer data", "Theirs to keep", "pos"],
    ],
    total: ["Restaurant keeps", "£29.55"],
  },
  note: "Liberq total is after typical card fees (1.5%). Illustrative.",
};

export const how = {
  eyebrow: {
    restaurant: "What your app does",
    partner: "How it works for partners",
  },
  title: {
    restaurant: ["Everything your customers need.", "Nothing they don’t."],
    partner: ["You introduce.", "We build, launch and support."],
  },
  // Restaurant steps. `screens` with more than one image auto-slides like a carousel.
  steps: [
    {
      title: "Your menu, your brand",
      body: "Your name, logo and colours on the App Store and Google Play.",
      screens: [
        "/assets/screens/onboarding-1.webp",
        "/assets/screens/onboarding-2.webp",
        "/assets/screens/onboarding-3.webp",
      ],
    },
    {
      title: "Order by talking",
      body: "Customers ask the AI waiter and it builds the order for them.",
      screens: ["/assets/screens/voice-orb.webp"],
    },
    {
      title: "Fast, simple checkout",
      body: "Apple Pay, Google Pay and cards. Money goes straight to you.",
      screens: ["/assets/screens/payment-success.webp"],
    },
    {
      title: "Live delivery tracking",
      body: "Stuart, Uber Direct or your own drivers.",
      screens: ["/assets/screens/tracking.webp"],
    },
  ],
  partnerSteps: [
    {
      title: "Introduce a restaurant",
      body: "Show the owner the live demo app and the £9-per-order maths.",
    },
    {
      title: "We do the rest",
      body: "We design their app, publish it to the stores and train their team.",
    },
    {
      title: "They go live - you get paid",
      body: "Go-live bonus, then 20% of their subscription for 6 months.",
    },
  ],
  kitTitle: "Your partner kit",
  kit: [
    "Live demo app on your phone",
    "Sales deck & QR flyers",
    "Partner dashboard to track every signing",
    "Training in under an hour",
    "No fee to join - ever",
  ],
};

export const brands = {
  eyebrow: {
    restaurant: "One platform, many brands",
    partner: "Every signing is a new app",
  },
  title: {
    restaurant: ["Every restaurant gets its own app."],
    partner: ["Every restaurant you sign", "gets its own app."],
  },
  list: [
    {
      name: "Burger Hub",
      initial: "B",
      color: "#FF8A3D",
      image: "/assets/img/burger.jpg",
    },
    {
      name: "Pizza House",
      initial: "P",
      color: "#FF5A7A",
      image: "/assets/img/pizza.jpg",
    },
    {
      name: "Ember Kitchen",
      initial: "E",
      color: "#FF6B4A",
      image: "/assets/img/plate.jpg",
    },
    {
      name: "Cocoa Corner",
      initial: "C",
      color: "#D9A273",
      image: "/assets/img/cocoa.jpg",
    },
  ],
  partnerTag: "+£254.80",
  build: {
    eyebrow: "Your turn",
    title: {
      restaurant: ["Let’s build ", "your brand", " next."],
      partner: ["Who’s the ", "next brand", " you’ll bring?"],
    },
    body: {
      restaurant:
        "Send us your logo, colours and menu. We design your app, publish it to the App Store and Google Play, and hand you the keys.",
      partner:
        "Send us the restaurant’s details. We build their app, publish it to the stores - and your bonus is on its way.",
    },
    steps: [
      ["1 · Share", "Logo, colours, menu"],
      ["2 · We build", "App & QR web ordering"],
      ["3 · Go live", "In the app stores"],
    ],
    cta: { restaurant: "Build my app", partner: "Refer a restaurant" },
    screen: "/assets/screens/your-brand.webp",
  },
};

export const ai = {
  eyebrow: {
    restaurant: "Your AI waiter",
    partner: "The demo that sells itself",
  },
  title: {
    restaurant: ["An ", "AI waiter", " in every app."],
    partner: ["Let them ", "talk", " to it."],
  },
  sub: {
    restaurant:
      "Customers just talk or type. It understands cravings, budgets and dietary needs, suggests the perfect meal and takes the order - right through to payment.",
    partner:
      "Hand the owner your phone. They ask for “something spicy under £15” and watch the AI build the order. That is the moment they sign.",
  },
  // AI waiter screen recording (mp4 + webm). Set video: '' to fall back to the still screens below.
  video: "/assets/video/ai-waiter",
  poster: "/assets/video/ai-waiter-poster.jpg",
  screens: [
    "/assets/screens/ai-listening.webp",
    "/assets/screens/ai-thinking.webp",
    "/assets/screens/ai-picks.webp",
    "/assets/screens/payment-success.webp",
  ],
  // `at` = second in the recording when each step becomes active.
  beats: [
    {
      at: 0,
      title: "Open the AI waiter",
      body: "Tap and say hello - or pick a suggestion.",
    },
    {
      at: 8,
      title: "Just say it",
      body: "“I need to eat pizza but my budget is below 20 pounds.”",
    },
    {
      at: 21,
      title: "It checks the menu",
      body: "Budget, taste and what’s available right now.",
    },
    {
      at: 26,
      title: "Perfect picks",
      body: "Pizzas under £20, ready to add to the cart.",
    },
  ],
  // `beat` = which step shows the bubble.
  bubbles: [
    {
      beat: 0,
      who: "AI waiter",
      text: "Hi! I’m Liberq AI 👋 What are you craving today?",
    },
    {
      beat: 1,
      who: "🎙 Customer",
      text: "“I need to eat pizza but my budget is below 20 pounds.”",
      me: true,
    },
    { beat: 2, who: "AI waiter", text: "Finding pizzas under £20 for you…" },
    {
      beat: 3,
      who: "AI waiter",
      text: "Farm House, Hawaiian and Margarita - all £5.99. Want one added to your cart?",
    },
    { beat: 3, text: "✓ Added to cart in two taps", ok: true },
  ],
  stats: [
    ["24/7", "takes orders"],
    ["Voice + text", "order the way they like"],
    ["+18%", "target order value from upsells"],
  ],
};

export const dashboard = {
  eyebrow: { restaurant: "Your dashboard", partner: "Your partner dashboard" },
  title: {
    restaurant: "Run it all from one screen.",
    partner: "Watch your earnings grow.",
  },
  sub: {
    restaurant:
      "Menu, orders, customers and reports - no technical skills needed.",
    partner:
      "Every restaurant you sign, every bonus and every payout - in one place.",
  },
  note: "Sample figures.",
  restaurant: {
    menu: [
      "Overview",
      "Orders",
      "Menu",
      "Customers",
      "Promotions",
      "AI waiter",
      "Delivery",
      "Payouts",
    ],
    kpis: [
      ["Orders today", 86, ""],
      ["Revenue", 2148, "£"],
      ["Repeat customers", 61, "", "%"],
      ["Commission saved", 644, "£", "", "ok"],
    ],
    hours: [3, 5, 7, 11, 20, 16, 8, 6, 10, 18, 26, 22, 13], // orders per hour, 11am → 11pm
    channels: [
      ["App", 52, "#B48CFF"],
      ["AI waiter", 27, "#FF90B4"],
      ["QR web", 21, "#FFAB5C"],
    ],
    dishes: [
      ["Spicy Chicken Burger", 34, "/assets/img/burger.jpg"],
      ["Margherita", 26, "/assets/img/pizza.jpg"],
      ["Grill Plate", 19, "/assets/img/plate.jpg"],
      ["Hot Chocolate", 14, "/assets/img/cocoa.jpg"],
    ], // orders today
    revenue: [
      820, 910, 870, 1040, 1120, 1080, 1260, 1310, 1240, 1480, 1560, 1710, 1890,
      2148,
    ], // last 14 days (£)
    before: [
      700, 720, 690, 760, 780, 770, 800, 820, 810, 850, 860, 880, 900, 930,
    ],
    orders: [
      ["#1042 · £24.50", "Cooking", "amber"],
      ["#1041 · £12.49", "AI order", "lav"],
      ["#1040 · £31.00", "Delivered", "ok"],
      ["#1039 · £18.20", "Delivered", "ok"],
    ],
  },
  partner: {
    menu: [
      "Earnings",
      "My restaurants",
      "Leads",
      "Payouts",
      "Sales kit",
      "Training",
    ],
    kpis: [
      ["Restaurants live", 9, ""],
      ["Earned so far", 1912, "£"],
      ["Next payout · 28 Nov", 486, "£", "", "ok"],
      ["Leads in progress", 5, ""],
    ],
    months: [
      ["Apr", 62],
      ["May", 98],
      ["Jun", 131],
      ["Jul", 166],
      ["Aug", 228],
      ["Sep", 267],
      ["Oct", 324],
      ["Nov", 394],
    ], // £ earned per month
    split: [
      ["Go-live bonuses", 44, "#B48CFF"],
      ["Monthly commission", 56, "#FFAB5C"],
    ],
    restaurants: [
      ["Burger Hub · Growth", "Live · month 4", "ok"],
      ["Pizza House · Starter", "Live · month 2", "ok"],
      ["Ember Kitchen · Pro", "App being built", "amber"],
      ["Cocoa Corner · Growth", "Demo booked", "lav"],
    ],
  },
};

// ── 06 ──────────────────────────────────────────────────────────────────────
export const forRestaurants = {
  eyebrow: "06 - For restaurants",
  title: ["Keep the margin.", "Keep the customer."],
  calc: {
    title: "What could you keep?",
    orders: {
      label: "Delivery orders per week",
      min: 20,
      max: 600,
      step: 10,
      value: 120,
    },
    avg: { label: "Average order value", min: 10, max: 60, step: 1, value: 25 },
    share: {
      label: "Orders that move to your app",
      min: 5,
      max: 80,
      step: 5,
      value: 30,
    },
    marketplaceRate: 0.3,
    cardRate: 0.015,
    planMonthly: 129,
    resultLabel: "Commission kept per year",
    netLabel: "After your Growth plan",
    note: "Illustrative. Excludes delivery costs (Stuart, Uber Direct or your own drivers) and VAT.",
  },
  qr: {
    title: "Live on day one with QR ordering",
    steps: [
      "Scan the QR on your window, flyer or bag",
      "Your menu opens instantly in the browser",
      "Guest checkout with Apple Pay or Google Pay",
      "“Get the app and earn points” - they come back",
    ],
  },
  points: [
    "Higher average spend - the AI waiter suggests add-ons and meal deals on every order.",
    "Your customer list, your loyalty, your push notifications.",
  ],
  plans: [
    {
      name: "Starter",
      price: 79,
      unit: "/mo",
      blurb: "For a single takeaway getting started.",
      features: [
        "Branded iOS + Android app",
        "QR web-ordering link",
        "AI waiter - 300 conversations/mo",
        "Basic loyalty & promotions",
        "90-day reporting",
      ],
    },
    {
      name: "Growth",
      price: 129,
      unit: "/mo",
      featured: true,
      blurb: "For busy restaurants growing direct orders.",
      features: [
        "Everything in Starter",
        "AI waiter with voice - 1,000/mo",
        "Push notifications to segments",
        "Your own delivery drivers",
        "12-month analytics",
      ],
    },
    {
      name: "Pro",
      price: 219,
      unit: "/site",
      blurb: "For chains and multi-site groups.",
      features: [
        "Everything in Growth",
        "AI waiter - 3,000/site",
        "Multi-site dashboard",
        "Automated win-back campaigns",
        "Mailchimp / Klaviyo connection",
      ],
    },
  ],
  popular: "Most popular",
  footnote:
    "Pay annually - 2 months free. Not ready to commit? Start on Launch - £29/mo + 40p per order, capped at £129.",
};

export const forPartners = {
  eyebrow: "06 - For partners",
  title: ["Sell what restaurants", "already want."],
  calc: {
    title: "What could you earn?",
    perMonth: {
      label: "Restaurants you sign per month",
      min: 1,
      max: 10,
      step: 1,
      value: 3,
    },
    planLabel: "Typical plan",
    plans: ["Starter", "Growth", "Pro"],
    defaultPlan: "Growth",
    prices: { Starter: 79, Growth: 129, Pro: 219 },
    bonus: { Starter: 75, Growth: 100, Pro: 125 },
    commissionRate: 0.2,
    commissionMonths: 6,
    perLabel: "Per restaurant you sign",
    yearLabel: "Signing at this pace for 12 months",
    note: "Go-live bonus = 25% of the setup fee. Commission = 20% of the subscription for the first 6 months.",
  },
  timelineTitle: "When you get paid",
  timeline: [
    ["Go-live", "Bonus paid once the restaurant’s first month is paid"],
    ["Month 3", "Months 1–3 commission paid as one lump"],
    ["Month 6", "Months 4–6 commission paid if the restaurant is still active"],
  ],
  point:
    "The AI waiter is the feature that closes the deal - let them talk to it.",
};

export const contact = {
  title: {
    restaurant: ["Your restaurant deserves its own app."],
    partner: ["Your next income stream", "is one demo away."],
  },
  sub: {
    restaurant:
      "Book a 20-minute demo. We’ll show you your brand on a real phone.",
    partner: "Apply in two minutes. We’ll send your partner kit the same day.",
  },
  form: {
    restaurant: {
      title: "Book a free demo",
      name: "Your name",
      business: "Restaurant name",
      email: "Email",
      phone: "Phone number",
      submit: "Book my demo",
      success: "Thank you - we’ll be in touch within one working day.",
    },
    partner: {
      title: "Apply to become a partner",
      name: "Your name",
      business: "Area you cover",
      email: "Email",
      phone: "Phone number",
      submit: "Apply now",
      success: "Application received - your partner kit is on its way.",
    },
  },
  consent: "I agree to Liberq storing these details to contact me.",
  errors: {
    required: "Please fill in every field.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid UK phone number (e.g. 07123 456789).",
    consent: "Please tick the box so we can contact you.",
  },
  beta: {
    title: "Try the app first",
    body: "Join the beta and we’ll send you an invite - AI waiter included.",
    ios: "iPhone (TestFlight)",
    android: "Android",
    email: { ios: "Apple ID email", android: "Google account email" },
    consent: "I agree to Liberq contacting me about beta testing.",
    submit: "Request an invite",
    success: "You’re on the list. Watch your inbox for the invite.",
  },
};

export const footer = {
  line: "White-label ordering apps with an AI waiter built in",
};

export const ukCities = [
  "Aberdeen",
  "Bath",
  "Belfast",
  "Birmingham",
  "Bolton",
  "Bournemouth",
  "Bradford",
  "Brighton & Hove",
  "Bristol",
  "Cambridge",
  "Cardiff",
  "Chelmsford",
  "Coventry",
  "Derby",
  "Derry~Londonderry",
  "Dundee",
  "Edinburgh",
  "Exeter",
  "Glasgow",
  "Gloucester",
  "Huddersfield",
  "Hull",
  "Inverness",
  "Ipswich",
  "Leeds",
  "Leicester",
  "Lisburn",
  "Liverpool",
  "London",
  "Luton",
  "Manchester",
  "Middlesbrough",
  "Milton Keynes",
  "Newcastle upon Tyne",
  "Newport",
  "Northampton",
  "Norwich",
  "Nottingham",
  "Oxford",
  "Peterborough",
  "Plymouth",
  "Portsmouth",
  "Preston",
  "Reading",
  "Sheffield",
  "Southampton",
  "Stirling",
  "Stoke-on-Trent",
  "Sunderland",
  "Swansea",
  "Swindon",
  "Wolverhampton",
  "Wrexham",
  "York",
  "Other / multiple areas",
];

// Pick the restaurant/partner version of a field (or return it unchanged).
export const t = (v, mode) =>
  v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  ("restaurant" in v || "partner" in v)
    ? v[mode]
    : v;

// ── Brochure download callout (sits just above the contact forms) ─────────────
// PDFs live in public/brochures/. Replace a PDF with the same file name to update it.
export const brochure = {
  restaurant: {
    eyebrow: "Free brochure",
    title: ["Everything about Liberq,", "in four pages."],
    body: "Share it with your partner, your manager or your accountant. It explains the £9-per-order maths, the AI waiter, how we get you live and what each plan costs.",
    points: ["Why restaurants switch — the £9 maths", "What you get, including the AI waiter", "How we get you live in 2–4 weeks", "Plans, prices and setup fees"],
    file: "/brochures/liberq-restaurant-brochure.pdf",
    downloadName: "Liberq-Restaurant-Brochure.pdf",
    cover: "/brochures/restaurant-cover.webp",
    page: "/brochures/restaurant-page.webp",
    cta: "Download the restaurant brochure",
    meta: "PDF · 4 pages · A4",
  },
  partner: {
    eyebrow: "Partner brochure",
    title: ["Your pitch,", "ready to print."],
    body: "Everything you need to learn the offer and explain it to a restaurant owner — what you sell, what you earn from each plan, and when you get paid.",
    points: ["What you’re selling and why owners say yes", "What each plan earns you", "When the money arrives", "A price cheat sheet for owners"],
    file: "/brochures/liberq-partner-brochure.pdf",
    downloadName: "Liberq-Partner-Brochure.pdf",
    cover: "/brochures/partner-cover.webp",
    page: "/brochures/partner-page.webp",
    cta: "Download the partner brochure",
    meta: "PDF · 4 pages · A4",
  },
  view: "View online",
  other: {
    restaurant: { text: "Want to earn by recommending Liberq?", link: "Get the partner brochure" },
    partner: { text: "Pitching to a restaurant owner?", link: "Get the restaurant brochure" },
  },
};
