import type { Portfolio } from "@/models/Portfolio/Portfolio";
import { URLS } from "@/constants/urls";

const PORTFOLIO_BASE = URLS.ASSETS.PORTFOLIO_BASE;

export const Portfolios: Portfolio[] = [
  {
    slug: "daily-english-worksheet",
    name: "Daily English Worksheet",
    shortDescription:
      "A fresh, printable Year 2 English worksheet every day, written in Australian English",
    coverImage: "/images/portfolio/daily-english-worksheet.webp",
    url: "https://daily-english-worksheet.vercel.app/",
    longDescription:
      "A free learning app that creates a fresh two-page Year 2 English worksheet every day. Each printable activity pairs a short reading passage and vocabulary with comprehension questions and guided writing, using Australian English and difficulty levels designed for practice at home with a parent.",
    workplace: "Independent project",
    projectRole: "Creator & Sole Developer",
    roleDescription: [
      "Designed and built the full-stack product with Next.js and TypeScript",
      "Automated daily worksheet generation, PDF rendering and archiving",
      "Created responsive experiences for reading, printing and browsing by difficulty",
      "Deployed and operated the application on Vercel",
    ],
    members: ["Ping Cheng - Creator & Developer"],
    screenshots: [
      "/images/portfolio/daily-english-worksheet-today.webp",
      "/images/portfolio/daily-english-worksheet-history.webp",
    ],
    year: "2026",
  },
  {
    slug: "empire-cbs",
    name: "Empire CBS",
    shortDescription: "Empire CBS internal job management system",
    coverImage: `${PORTFOLIO_BASE}/empire-cbs/empire-cbs.webp`,
    url: null,
    longDescription:
      "An internal job management system that helps Empire CBS to record and track their project progress and manage their resources, timesheets and etc.",
    workplace: "Private project",
    projectRole: "Backend & DevOps Developer",
    roleDescription: [
      "Backend developments",
      "CI/CD implementation",
      "DevOps and Server management",
    ],
    members: [
      "Ping Cheng - Backend & DevOps Developer",
      "Johnson Yao - Frontend developer",
    ],
    screenshots: [
      `${PORTFOLIO_BASE}/empire-cbs/empire-cbs-1.webp`,
      `${PORTFOLIO_BASE}/empire-cbs/empire-cbs-2.webp`,
      `${PORTFOLIO_BASE}/empire-cbs/empire-cbs-3.webp`,
      `${PORTFOLIO_BASE}/empire-cbs/empire-cbs-4.webp`,
    ],
    year: "2020-2021",
  },
  {
    slug: "pteplus",
    name: "PTEPLUS",
    shortDescription:
      "PTEPLUS provides a user friendly UI and accurate machine scoring for PTE test taker",
    coverImage: `${PORTFOLIO_BASE}/pteplus/pteplus.webp`,
    url: null,
    longDescription:
      "PTEPLUS is the first of its' kind 'smart platform' for English language practice in Australia. Its' Natural Language Processing technology provides PTE applicants with automated machine grading in alignment with the PTE Academic official score guide, such that PTE Academic future Test takers may practise for the Test, and also easily gauge their current standards and Test-readiness.",
    workplace: "Eduplus 2016 - 2019",
    projectRole: "Development Lead",
    roleDescription: [
      "The decision on tech stack",
      "Architecture design and implement",
      "Requirements analysis and breakdown",
      "Tasks split up and allocation",
      "Backend/Frontend developments",
      "Bridging different teams",
    ],
    members: [
      "Ping Cheng - Development lead",
      "Zoe Wang - Frontend developer",
      "Wayne Zhang - Backend developer",
      "Jeffery Wu - Backend developer",
      "Irene Zhang - Frontend developer",
    ],
    screenshots: [
      `${PORTFOLIO_BASE}/pteplus/1.webp`,
      `${PORTFOLIO_BASE}/pteplus/2.webp`,
      `${PORTFOLIO_BASE}/pteplus/aio1.webp`,
      `${PORTFOLIO_BASE}/pteplus/aio2.webp`,
      `${PORTFOLIO_BASE}/pteplus/aio3.webp`,
      `${PORTFOLIO_BASE}/pteplus/aio4.webp`,
      `${PORTFOLIO_BASE}/pteplus/exam1.webp`,
      `${PORTFOLIO_BASE}/pteplus/op1.webp`,
      `${PORTFOLIO_BASE}/pteplus/op2.webp`,
      `${PORTFOLIO_BASE}/pteplus/op3.webp`,
      `${PORTFOLIO_BASE}/pteplus/op4.webp`,
      `${PORTFOLIO_BASE}/pteplus/op5.webp`,
      `${PORTFOLIO_BASE}/pteplus/report-analysis.webp`,
    ],
    year: "2016-2019",
  },
  {
    slug: "pinhr",
    name: "PinHR",
    shortDescription: "A customised human resources management tool",
    coverImage: `${PORTFOLIO_BASE}/pinhr/cover.webp`,
    url: null,
    longDescription:
      "A customised human resources management tool, including online application form and auto email system",
    workplace: "EDUPLUS",
    projectRole: "Sole Developer",
    roleDescription: [
      "The decision on tech stack",
      "Architecture design and implement",
      "Requirements analysis and breakdown",
      "Backend/Frontend developments",
    ],
    members: ["Ping Cheng - Developer"],
    screenshots: [
      `${PORTFOLIO_BASE}/pinhr/1.webp`,
      `${PORTFOLIO_BASE}/pinhr/2.webp`,
      `${PORTFOLIO_BASE}/pinhr/3.webp`,
      `${PORTFOLIO_BASE}/pinhr/4.webp`,
      `${PORTFOLIO_BASE}/pinhr/5.webp`,
      `${PORTFOLIO_BASE}/pinhr/6.webp`,
      `${PORTFOLIO_BASE}/pinhr/7.webp`,
    ],
    year: "2018",
  },
  {
    slug: "vatgc",
    name: "VAGTC",
    shortDescription: "The final year project in the university",
    coverImage: `${PORTFOLIO_BASE}/vagtc/vagtc.webp`,
    url: "https://www.vagtc.org.au/",
    longDescription:
      "The final year project in the university, worked with the non-profit organisation to provide a modern and clean website. The web is WordPress based.",
    workplace: "Swinburne University",
    projectRole: "Developer",
    roleDescription: [
      "Setup the WordPress",
      "Customise the theme",
      "Integrate plugins",
    ],
    members: [
      "Fame - Team Leader",
      "Ping Cheng - Developer",
      "Salil Batra - Developer",
    ],
    screenshots: [
      `${PORTFOLIO_BASE}/vagtc/1.webp`,
      `${PORTFOLIO_BASE}/vagtc/2.webp`,
      `${PORTFOLIO_BASE}/vagtc/3.webp`,
      `${PORTFOLIO_BASE}/vagtc/4.webp`,
    ],
    year: "2015",
  },
  {
    slug: "qce-eduplus",
    name: "QCE Eduplus",
    shortDescription:
      "Maths practice platform partners with Cengage for Queensland secondary schools",
    coverImage: `${PORTFOLIO_BASE}/qce-eduplus/cover.webp`,
    url: null,
    longDescription:
      "EduPlus empowers teachers and students with immediate feedback, live progress tracking, and real-time actionable insights – so you can harness more potential with less effort",
    workplace: "EDUPLUS",
    projectRole: "Development Lead",
    roleDescription: [
      "The decision on tech stack",
      "Architecture design and implement",
      "Requirements analysis and breakdown",
      "Tasks split up and allocation",
      "Backend/Frontend developments",
      "Bridging different teams",
    ],
    members: [
      "Ping Cheng - Development Lead",
      "Jeffery Wu - Backend/Frontend developer",
    ],
    screenshots: [
      `${PORTFOLIO_BASE}/qce-eduplus/1.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/2.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/3.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/4.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/5.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/6.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/7.webp`,
      `${PORTFOLIO_BASE}/qce-eduplus/8.webp`,
    ],
    year: "2019-2020",
  },
  {
    slug: "rhfoto",
    name: "RH.foto",
    shortDescription:
      "A simplistic and clean photo wall for a group of professional photographers",
    coverImage: `${PORTFOLIO_BASE}/rhfoto/rhfoto.webp`,
    url: "https://rhfoto.com.au/",
    longDescription:
      "A simple and clean Wordpress based website for a group of professional wedding photographers demonstrates their abilities to deliver high end, breathtaking, fashionable and personalised images.",
    workplace: "Private project",
    projectRole: "Sole Developer",
    roleDescription: [
      "Wordpress customisation",
      "Theme development",
      "Plugin integration",
    ],
    members: ["Ping Cheng - Developer"],
    screenshots: [
      `${PORTFOLIO_BASE}/rhfoto/1.webp`,
      `${PORTFOLIO_BASE}/rhfoto/2.webp`,
      `${PORTFOLIO_BASE}/rhfoto/3.webp`,
    ],
    year: "2017",
  },
];
