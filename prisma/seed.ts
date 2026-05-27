import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding Nawiri Impact Africa database...");

  // ─── SITE SETTINGS ───
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      site_name: "Nawiri Impact Africa",
      site_tagline: "Rooted Here. Building Together.",
      logo_url: "/images/logo-placeholder.svg",
      favicon_url: "/favicon.ico",
      primary_color: "#1B5E20",
      secondary_color: "#D4A017",
      font_heading: "Playfair Display",
      font_body: "Source Serif 4",
      contact_email: "kenyajobs@wr.org",
      contact_phone: "+254 700 000 000",
      physical_address: "Nairobi, Kenya",
      social_twitter: "",
      social_linkedin: "",
      social_facebook: "",
      social_youtube: "",
      footer_description:
        "Nawiri Impact Africa is a Kenyan NGO delivering programmes in community development, humanitarian response, livelihood support, and social protection across the country.",
      footer_links: JSON.stringify([
        { label: "About", url: "/about" },
        { label: "Programmes", url: "/programmes" },
        { label: "Impact & Stories", url: "/impact" },
        { label: "Reports & Financials", url: "/reports" },
        { label: "Partnerships", url: "/partnerships" },
        { label: "Careers", url: "/careers" },
        { label: "Blog & News", url: "/blog" },
        { label: "Donate / Get Involved", url: "/donate" },
        { label: "Contact", url: "/contact" },
        { label: "Safeguarding", url: "/safeguarding" },
      ]),
      cookie_banner_text:
        "We use cookies to improve your experience on our website.",
      maintenance_mode: false,
    },
  });

  // ─── HOME SETTINGS ───
  await prisma.homeSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      hero_headline: "Rooted Here. Building Together.",
      hero_subheadline:
        "A Kenyan organization, governed locally, serving communities across the country.",
      hero_cta_primary_label: "See Our Work",
      hero_cta_primary_url: "/programmes",
      hero_cta_secondary_label: "Donate Now",
      hero_cta_secondary_url: "/donate",
      hero_background_image: "/images/hero-bg.jpg",
      hero_overlay_opacity: 50,
      hero_text_alignment: "center",
      stats: JSON.stringify([
        {
          number: "35,000",
          label: "Communities Reached",
          icon: "MapPin",
          prefix: "",
          suffix: "+",
        },
        {
          number: "500,000",
          label: "Individuals Served",
          icon: "Users",
          prefix: "",
          suffix: "",
        },
        {
          number: "20",
          label: "Counties of Operation",
          icon: "Map",
          prefix: "",
          suffix: "",
        },
        {
          number: "30",
          label: "Years of Impact",
          icon: "Heart",
          prefix: "",
          suffix: "+",
        },
      ]),
      stats_bar_bg_color: "#1B5E20",
      home_programmes_heading: "Our Programmes",
      home_programmes_subtext:
        "Delivering programmes that build resilience, restore dignity, and create lasting opportunity.",
      home_featured_programmes: JSON.stringify([
        "community-resilience",
        "humanitarian-response",
        "child-wellbeing",
        "health-nutrition",
      ]),
      home_cta_heading: "Join Us in Building a Better Kenya",
      home_cta_body:
        "Your support helps communities thrive. Partner with us to create lasting change across Kenya.",
      home_cta_button_label: "Get Involved",
      home_cta_button_url: "/donate",
      home_cta_background: "#D4A017",
    },
  });

  // ─── PROGRAMMES ───
  const programmes = [
    {
      title: "Community Resilience & Livelihoods",
      slug: "community-resilience",
      short_description:
        "Supporting households and communities to build sustainable income, savings, and economic stability through market linkages, savings groups, and vocational skills training.",
      full_description:
        "Our Community Resilience & Livelihoods programme works with women, youth, and smallholder households in peri-urban and rural Kenya to build sustainable pathways out of poverty. Through savings and credit groups, market linkage facilitation, and vocational training, we empower communities to take charge of their economic futures.\n\nWe believe that lasting change comes from within communities. Our approach centres on building local capacity, strengthening community institutions, and creating opportunities for sustainable income generation.",
      cover_image: "/images/programme-resilience.jpg",
      icon: "Leaf",
      color_accent: "#2E7D32",
      target_beneficiaries:
        "Women, youth, and smallholder households in peri-urban and rural Kenya.",
      key_activities: JSON.stringify([
        "Savings and credit groups",
        "Market linkage facilitation",
        "Vocational training",
        "Business skills development",
      ]),
      impact_stat_1_number: "12,000",
      impact_stat_1_label: "Households Supported",
      impact_stat_2_number: "450",
      impact_stat_2_label: "Savings Groups Active",
      impact_stat_3_number: "67",
      impact_stat_3_label: "% Income Increase",
      status: "published",
      sort_order: 1,
    },
    {
      title: "Humanitarian Response & Social Protection",
      slug: "humanitarian-response",
      short_description:
        "Delivering timely, dignified humanitarian assistance to communities affected by displacement, drought, floods, and acute vulnerability through cash transfers, food assistance, and protection monitoring.",
      full_description:
        "Our Humanitarian Response & Social Protection programme delivers timely, dignified assistance to communities affected by displacement, drought, floods, and acute vulnerability. We provide cash and voucher assistance, food distribution, protection referrals, and WASH support to the most vulnerable households.\n\nOur approach prioritises dignity, community participation, and the strengthening of local response systems. We work closely with government authorities and other humanitarian actors to ensure a coordinated and effective response.",
      cover_image: "/images/programme-humanitarian.jpg",
      icon: "Shield",
      color_accent: "#C62828",
      target_beneficiaries:
        "Displaced populations, drought-affected communities, and households in acute need.",
      key_activities: JSON.stringify([
        "Cash and voucher assistance",
        "Food distribution",
        "Protection referrals",
        "WASH support",
      ]),
      impact_stat_1_number: "200,000",
      impact_stat_1_label: "Individuals Reached",
      impact_stat_2_number: "15",
      impact_stat_2_label: "Counties Covered",
      impact_stat_3_number: "82",
      impact_stat_3_label: "% Improved Food Security",
      status: "published",
      sort_order: 2,
    },
    {
      title: "Child & Family Wellbeing",
      slug: "child-wellbeing",
      short_description:
        "Strengthening family units and ensuring children grow up safe, healthy, and educated through child protection, parenting support, and early childhood development programming.",
      full_description:
        "Our Child & Family Wellbeing programme strengthens family units and ensures children grow up safe, healthy, and educated. We address child protection, parenting support, early childhood development, and school-based interventions.\n\nEvery child deserves a safe and nurturing environment. Our programming focuses on building protective factors within families and communities, while ensuring that children who face abuse or neglect receive the support they need to recover and thrive.",
      cover_image: "/images/programme-child.jpg",
      icon: "Baby",
      color_accent: "#1565C0",
      target_beneficiaries:
        "Children aged 0-17, caregivers, and families in vulnerable circumstances.",
      key_activities: JSON.stringify([
        "Child protection case management",
        "Parenting groups",
        "ECD centre support",
        "School-based nutrition",
      ]),
      impact_stat_1_number: "85,000",
      impact_stat_1_label: "Children Reached",
      impact_stat_2_number: "3,200",
      impact_stat_2_label: "Cases Managed",
      impact_stat_3_number: "120",
      impact_stat_3_label: "ECD Centres Supported",
      status: "published",
      sort_order: 3,
    },
    {
      title: "Health & Nutrition",
      slug: "health-nutrition",
      short_description:
        "Improving health outcomes for the most vulnerable through community health worker networks, nutrition programming, maternal and child health support, and WASH integration.",
      full_description:
        "Our Health & Nutrition programme improves health outcomes for the most vulnerable through community health worker networks, nutrition programming, maternal and child health support, and WASH integration.\n\nWe work through trained community health volunteers who are embedded in the communities they serve, ensuring that health services reach even the most remote and underserved populations.",
      cover_image: "/images/programme-health.jpg",
      icon: "HeartPulse",
      color_accent: "#E65100",
      target_beneficiaries:
        "Mothers, infants, and under-5 children in rural and peri-urban communities.",
      key_activities: JSON.stringify([
        "Community health worker training",
        "MIYCN counselling",
        "WASH infrastructure",
        "Referral pathways",
      ]),
      impact_stat_1_number: "45,000",
      impact_stat_1_label: "Children Treated",
      impact_stat_2_number: "30,000",
      impact_stat_2_label: "Mothers Reached",
      impact_stat_3_number: "85",
      impact_stat_3_label: "Health Facilities Supported",
      status: "published",
      sort_order: 4,
    },
  ];

  for (const prog of programmes) {
    await prisma.programme.upsert({
      where: { slug: prog.slug },
      update: {},
      create: prog,
    });
  }

  // ─── FEATURED STORY ───
  const featuredStory = await prisma.story.upsert({
    where: { slug: "aminas-journey" },
    update: {},
    create: {
      title: "Amina's Journey: From Savings Group to Business Owner",
      slug: "aminas-journey",
      excerpt:
        "With support from Nawiri's livelihood programme, Amina transformed her small savings into a thriving business that now employs five other women from her community.",
      author_name: "Amina Wanjiru",
      author_role: "Small Business Owner, Kisumu County",
      cover_image: "/images/story-amina.jpg",
      body: "Amina Wanjiru never imagined that joining a savings group would change her life. When Nawiri Impact Africa established a savings and credit group in her village in Kisumu County, Amina was one of the first to sign up.\n\nStarting with just KES 50 per week, Amina and her group members slowly built their savings. After six months, Amina was able to take her first loan of KES 5,000, which she used to buy seeds and fertiliser for her small farm.\n\nToday, Amina runs a successful vegetable business at the local market, earning enough to feed her family, pay school fees for her three children, and employ five other women from her community. Her story is a testament to the power of community-driven economic empowerment.",
      programme_id: "community-resilience",
      location: "Kisumu County",
      published_date: new Date("2024-09-15"),
      is_featured: true,
      pull_quote:
        "I never thought KES 50 a week could change my life. Now I employ five women and my children are in school. Nawiri showed me what was possible.",
      status: "published",
      tags: JSON.stringify(["women", "livelihoods", "savings", "success-story"]),
    },
  });

  // ─── ADDITIONAL STORIES ───
  const additionalStories = [
    {
      title: "From Displacement to Dignity: Fatuma's Story",
      slug: "fatumas-story",
      excerpt: "After being displaced by floods in Tana River County, Fatuma received cash assistance from Nawiri that helped her rebuild her home and restart her small business.",
      author_name: "Fatuma Hassan",
      author_role: "Community Member, Tana River County",
      cover_image: "/images/blog-post-2.jpg",
      body: "When the floods came, Fatuma Hassan lost everything — her home, her small shop, and her sense of security. She and her five children spent weeks in a displacement camp with little hope.\n\nNawiri Impact Africa's emergency response team arrived with cash transfers that allowed families like Fatuma's to make their own choices about what they needed most. For Fatuma, that meant restocking her shop and repairing her home.\n\nToday, Fatuma's shop is thriving again. She has even expanded her inventory and hired a young person from the community to help.",
      programme_id: "humanitarian-response",
      location: "Tana River County",
      published_date: new Date("2024-10-15"),
      is_featured: false,
      pull_quote: "The cash assistance gave me the power to decide what my family needed most. I didn't just survive — I rebuilt.",
      status: "published",
      tags: JSON.stringify(["humanitarian", "cash-assistance", "resilience"]),
    },
    {
      title: "A Father's Fight: Keeping His Children in School",
      slug: "josephs-story",
      excerpt: "When drought threatened his family's food security, Joseph joined a Nawiri savings group that helped him keep his three children in school while diversifying his income.",
      author_name: "Joseph Mutua",
      author_role: "Farmer and Father, Machakos County",
      cover_image: "/images/blog-post-1.jpg",
      body: "Joseph Mutua has always believed that education is the key to his children's future. But when consecutive drought seasons destroyed his crops in Machakos County, keeping his three children in school became an impossible challenge.\n\nThrough Nawiri's Community Resilience programme, Joseph joined a savings group and received training in drought-resistant farming techniques. He also accessed a small loan that allowed him to start a poultry business alongside his farming.\n\nNow, even when the rains fail, Joseph's diversified income means his children never have to miss school.",
      programme_id: "community-resilience",
      location: "Machakos County",
      published_date: new Date("2024-11-01"),
      is_featured: false,
      pull_quote: "My children's education is the most important investment I can make. Nawiri helped me protect that.",
      status: "published",
      tags: JSON.stringify(["education", "livelihoods", "drought", "savings"]),
    },
  ];

  for (const story of additionalStories) {
    await prisma.story.upsert({
      where: { slug: story.slug },
      update: {},
      create: story,
    });
  }

  // Link featured story to home settings
  await prisma.homeSettings.update({
    where: { id: "main" },
    data: { featured_story_id: featuredStory.id },
  });

  // ─── BLOG POSTS ───
  const blogPosts = [
    {
      title: "Nawiri Launches Community Savings Programme in Garissa County",
      slug: "savings-programme-garissa",
      excerpt:
        "Nawiri Impact Africa has expanded its community resilience programme to Garissa County, establishing 25 new savings groups that will support over 500 households in the region.",
      body: "In a significant expansion of its livelihood programme, Nawiri Impact Africa has launched a new community savings initiative in Garissa County. The programme aims to establish 25 savings and credit groups across the county, reaching more than 500 households in its first year.\n\nThe launch event, attended by county government officials and community leaders, marked the beginning of what promises to be a transformative programme for the region.",
      cover_image: "/images/blog-post-1.jpg",
      category: "Programme Updates",
      author_name: "Nawiri Communications",
      published_date: new Date("2024-11-20"),
      is_featured: false,
      status: "published",
    },
    {
      title: "Emergency Response: Reaching Flood-Affected Communities in Tana River",
      slug: "emergency-response-tana-river",
      excerpt:
        "Following devastating floods in Tana River County, Nawiri's humanitarian team deployed rapidly to provide cash assistance, food supplies, and WASH support to over 3,000 displaced families.",
      body: "When heavy rains caused severe flooding in Tana River County, Nawiri Impact Africa's humanitarian response team was among the first on the ground. Working alongside county government and other humanitarian actors, the team provided emergency cash transfers to over 3,000 displaced households.\n\nThe response included food assistance, non-food item distribution, and critical WASH support to prevent waterborne disease outbreaks in displacement camps.",
      cover_image: "/images/blog-post-2.jpg",
      category: "Humanitarian",
      author_name: "James Mwangi",
      published_date: new Date("2024-10-05"),
      is_featured: false,
      status: "published",
    },
    {
      title: "Celebrating 30 Years of Impact in Kenya",
      slug: "30-years-impact-kenya",
      excerpt:
        "As Nawiri Impact Africa marks 30 years of service to Kenyan communities, we reflect on three decades of resilience, partnership, and transformative change across the country.",
      body: "This year marks a significant milestone for Nawiri Impact Africa — 30 years of dedicated service to communities across Kenya. From our earliest days as World Relief Kenya to our emergence as an independent, locally governed organisation, our commitment to walking alongside communities has never wavered.\n\nOver three decades, we have reached hundreds of thousands of individuals through programmes spanning community resilience, humanitarian response, child protection, and health and nutrition.",
      cover_image: "/images/blog-post-3.jpg",
      category: "News",
      author_name: "Nawiri Communications",
      published_date: new Date("2024-12-01"),
      is_featured: true,
      status: "published",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // ─── PARTNERS ───
  const partners = [
    {
      name: "USAID",
      logo_url: "/images/partner-placeholder.svg",
      description: "United States Agency for International Development",
      partner_type: "Donor",
      sort_order: 1,
      is_featured: true,
      status: "published",
    },
    {
      name: "UNICEF",
      logo_url: "/images/partner-placeholder.svg",
      description: "United Nations Children's Fund",
      partner_type: "Donor",
      sort_order: 2,
      is_featured: true,
      status: "published",
    },
    {
      name: "World Food Programme",
      logo_url: "/images/partner-placeholder.svg",
      description: "WFP Kenya",
      partner_type: "Implementing Partner",
      sort_order: 3,
      is_featured: true,
      status: "published",
    },
    {
      name: "County Government of Nairobi",
      logo_url: "/images/partner-placeholder.svg",
      description: "Nairobi County Government partnership",
      partner_type: "Government",
      sort_order: 4,
      is_featured: true,
      status: "published",
    },
    {
      name: "Danida",
      logo_url: "/images/partner-placeholder.svg",
      description: "Danish International Development Agency",
      partner_type: "Donor",
      sort_order: 5,
      is_featured: true,
      status: "published",
    },
    {
      name: "European Union",
      logo_url: "/images/partner-placeholder.svg",
      description: "EU humanitarian and development partnership",
      partner_type: "Donor",
      sort_order: 6,
      is_featured: true,
      status: "published",
    },
  ];

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { id: `${partner.slug || partner.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: partner.name.toLowerCase().replace(/\s+/g, '-'),
        ...partner,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("   - Site settings created");
  console.log("   - Home settings created");
  console.log("   - 4 programmes created");
  console.log("   - 3 stories created");
  console.log("   - 3 blog posts created");
  console.log("   - 6 partners created");

  // ─── TEAM MEMBERS ───
  const teamMembers = [
    {
      id: "ceo-james",
      name: "James Ochieng",
      role: "Executive Director",
      bio: "James has over 20 years of experience in humanitarian and development work across East Africa. He leads Nawiri's strategic vision and oversees all programme operations.",
      photo: "/images/team-ceo.jpg",
      email: "james@nawiriimpactafrica.org",
      sort_order: 1,
      is_leadership: true,
      status: "published",
    },
    {
      id: "prog-grace",
      name: "Grace Akinyi",
      role: "Director of Programmes",
      bio: "Grace brings 15 years of expertise in community development and social protection. She oversees the design and implementation of all Nawiri programmes.",
      photo: "/images/team-programmes.jpg",
      email: "grace@nawiriimpactafrica.org",
      sort_order: 2,
      is_leadership: true,
      status: "published",
    },
    {
      id: "fin-david",
      name: "David Kimani",
      role: "Finance & Operations Manager",
      bio: "David is a certified accountant with extensive experience in NGO financial management and compliance. He ensures sound stewardship of all resources entrusted to Nawiri.",
      photo: "/images/team-finance.jpg",
      email: "david@nawiriimpactafrica.org",
      sort_order: 3,
      is_leadership: true,
      status: "published",
    },
    {
      id: "me-wanjiku",
      name: "Wanjiku Njeri",
      role: "Monitoring, Evaluation & Learning Officer",
      bio: "Wanjiku leads Nawiri's evidence and learning function, ensuring that programme impact is rigorously measured and used to improve future programming.",
      photo: "/images/team-me.jpg",
      email: "wanjiku@nawiriimpactafrica.org",
      sort_order: 4,
      is_leadership: false,
      status: "published",
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {},
      create: member,
    });
  }

  // ─── REPORTS ───
  const reports = [
    {
      title: "Annual Report 2024",
      description: "Nawiri Impact Africa's annual report for 2024, covering programme achievements, financial summary, and impact highlights across all counties of operation.",
      document_type: "Annual Report",
      year: 2024,
      file_url: "/reports/nawiri-annual-report-2024.pdf",
      is_featured: true,
      status: "published",
    },
    {
      title: "Annual Report 2023",
      description: "Comprehensive review of Nawiri's work in 2023, including the organizational transition from World Relief Kenya to Nawiri Impact Africa.",
      document_type: "Annual Report",
      year: 2023,
      file_url: "/reports/nawiri-annual-report-2023.pdf",
      is_featured: false,
      status: "published",
    },
    {
      title: "Humanitarian Response Evaluation — Tana River 2024",
      description: "Independent evaluation of Nawiri's emergency flood response in Tana River County, assessing effectiveness and lessons learned.",
      document_type: "Evaluation",
      year: 2024,
      file_url: "/reports/tana-river-evaluation-2024.pdf",
      is_featured: false,
      status: "published",
    },
    {
      title: "Financial Statements 2023",
      description: "Audited financial statements for the year ended December 2023.",
      document_type: "Financial Report",
      year: 2023,
      file_url: "/reports/financial-statements-2023.pdf",
      is_featured: false,
      status: "published",
    },
  ];

  for (const report of reports) {
    await prisma.report.upsert({
      where: { id: report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      update: {},
      create: {
        id: report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...report,
      },
    });
  }

  // ─── CAREERS ───
  const careers = [
    {
      job_title: "Programme Manager — Livelihoods",
      slug: "programme-manager-livelihoods",
      department: "Programmes",
      location: "Nairobi",
      employment_type: "Full-time",
      description: "We are seeking an experienced Programme Manager to lead our Community Resilience & Livelihoods programme across multiple counties. The ideal candidate will have strong experience in savings group methodologies, market systems development, and community-driven development approaches.",
      requirements: "Master's degree in Development Studies, Economics, or related field. At least 7 years of experience in programme management within the NGO sector. Strong experience with savings groups, livelihoods programming, and community engagement. Excellent written and verbal communication skills in English and Swahili.",
      how_to_apply: "Send your CV and cover letter to kenyajobs@wr.org with the subject line 'Programme Manager — Livelihoods'.",
      application_email: "kenyajobs@wr.org",
      application_deadline: new Date("2025-02-28"),
      salary_range: "KES 250,000 — 350,000 per month",
      is_urgent: true,
      status: "open",
    },
    {
      job_title: "Monitoring, Evaluation & Learning Manager",
      slug: "mel-manager",
      department: "Programme Quality",
      location: "Nairobi",
      employment_type: "Full-time",
      description: "Nawiri is looking for an MEL Manager to strengthen our evidence base and ensure rigorous measurement of programme outcomes. This role will lead the design of MEL frameworks, manage data systems, and produce high-quality reports for donors and stakeholders.",
      requirements: "Master's degree in Statistics, Monitoring & Evaluation, or related field. Minimum 5 years of MEL experience in the development/humanitarian sector. Proficiency in data management tools and statistical software. Strong analytical and report writing skills.",
      how_to_apply: "Send your CV and cover letter to kenyajobs@wr.org with the subject line 'MEL Manager'.",
      application_email: "kenyajobs@wr.org",
      application_deadline: new Date("2025-03-15"),
      salary_range: "KES 200,000 — 300,000 per month",
      is_urgent: false,
      status: "open",
    },
    {
      job_title: "Community Health Officer — Wajir County",
      slug: "community-health-officer-wajir",
      department: "Health & Nutrition",
      location: "Wajir",
      employment_type: "Full-time",
      description: "The Community Health Officer will oversee Nawiri's health and nutrition programming in Wajir County, managing community health volunteer networks, MIYCN counselling, and health facility partnerships.",
      requirements: "Bachelor's degree in Public Health, Nursing, or related field. At least 3 years of experience in community health programming in ASAL areas. Experience with MIYCN, IMCI, and community health volunteer management. Willingness to travel extensively within Wajir County.",
      how_to_apply: "Send your CV and cover letter to kenyajobs@wr.org with the subject line 'Community Health Officer — Wajir'.",
      application_email: "kenyajobs@wr.org",
      application_deadline: new Date("2025-02-15"),
      salary_range: "KES 120,000 — 180,000 per month",
      is_urgent: false,
      status: "open",
    },
  ];

  for (const career of careers) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: {},
      create: career,
    });
  }

  console.log("   - 4 team members created");
  console.log("   - 4 reports created");
  console.log("   - 3 careers created");

  // ─── ABOUT SETTINGS ───
  await prisma.aboutSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      about_headline: "About Nawiri Impact Africa",
      about_body: "Nawiri Impact Africa, formerly operating as World Relief Kenya, is a Kenyan NGO undergoing a complete organizational identity transition. It is separating from its former international affiliation to become a fully independent, locally governed entity. This transition is a significant organizational milestone — the new brand, the new name, and the new website all represent its commitment to being a locally rooted, community-driven institution rather than a branch of an international body.\n\nThe organization works across Kenya delivering programmes in community development, humanitarian response, livelihood support, and social protection.",
      mission_statement: "To walk alongside Kenyan communities — delivering programmes that build resilience, restore dignity, and create lasting opportunity.",
      vision_statement: "A Kenya where every community has the agency, resources, and support to thrive.",
      about_hero_image: "/images/about-hero.jpg",
      values: JSON.stringify([
        {
          icon: "ShieldCheck",
          title: "Integrity",
          description: "We uphold the highest standards of transparency and accountability in everything we do — from financial stewardship to community engagement."
        },
        {
          icon: "Users",
          title: "Community",
          description: "We believe lasting change comes from within. We walk alongside communities, listening first and co-creating solutions that truly fit."
        },
        {
          icon: "Heart",
          title: "Dignity",
          description: "Every person has inherent worth. Our programmes are designed to empower, not to create dependency — restoring dignity at every step."
        },
        {
          icon: "Star",
          title: "Excellence",
          description: "We pursue the highest quality in our work, grounded in evidence and learning. Good enough is never enough when lives are at stake."
        }
      ]),
      history_timeline: JSON.stringify([
        { year: "1994", event: "Established operations in Kenya as a branch of World Relief, responding to acute local humanitarian needs." },
        { year: "2005", event: "Expanded programming into Community Livelihoods and child development in peri-urban areas." },
        { year: "2015", event: "Scaled up health, nutrition, and drought resilience initiatives across dryland (ASAL) counties." },
        { year: "2024", event: "Transitioned to a fully independent, locally-governed Kenyan NGO under the name Nawiri Impact Africa." }
      ])
    }
  });
  console.log("   - About settings created");

  // ─── SAFEGUARDING SETTINGS ───
  await prisma.safeguardingSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      safeguarding_headline: "Safeguarding & Accountability",
      commitment_statement: "Nawiri Impact Africa is committed to the safety, dignity, and protection of all people we work with, particularly children and vulnerable adults. We have zero tolerance for abuse, exploitation, or harassment in any form. All staff, volunteers, and partners are required to uphold our Safeguarding Policy and report concerns immediately.",
      reporting_contact_email: "safeguarding@nawiriimpactafrica.org",
      policy_documents: JSON.stringify([
        { "title": "Safeguarding Policy (Child Protection & PSEA)", "file_url": "#" },
        { "title": "Code of Conduct", "file_url": "#" },
        { "title": "Complaints & Feedback Mechanism", "file_url": "#" },
        { "title": "Anti-Fraud and Corruption Policy", "file_url": "#" },
        { "title": "Data Protection Policy", "file_url": "#" }
      ]),
      last_reviewed_date: new Date("2025-01-15")
    }
  });
  console.log("   - Safeguarding settings created");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
