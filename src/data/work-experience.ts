export type WorkPosition = {
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
};

export type Company = {
  name: string;
  linkedInUrl?: string;
};

export type WorkExperience = {
  company: Company;
  positions: WorkPosition[];
};

export const workExperiences: WorkExperience[] = [
  {
    company: {
      name: "REA Group - PropTrack",
      linkedInUrl: "https://www.linkedin.com/company/rea-group",
    },
    positions: [
      {
        position: "Principal Engineer",
        startDate: "Feb 2026",
        endDate: "Present",
        description: []
      },
      {
        position: "Staff Engineer",
        startDate: "July 2025",
        endDate: "Jan 2026",
        description: []
      },
      {
        position: "Lead Developer",
        startDate: "Aug 2024",
        endDate: "July 2025",
        description: [],
      },
      {
        position: "Senior Developer",
        startDate: "Jul 2022",
        endDate: "Aug 2024",
        description: [
          "Highly involved in digital mortgage areas, seamlessly connecting banks and the valuation industry with modern digital solutions. Contributing to the development of secure, enterprise-level products.",
          ":line-break:",
          "Key Responsibilities:",
          "- Collaborate closely with the lead developer to design system solutions.",
          "- Utilise existing group-wide infrastructure to optimise efficiency and avoid redundancy.",
          "- Take the lead in developing feature slices and efficiently allocate work within the team.",
          "- Provide mentorship to less experienced developers within the team.",
        ],
      },
      {
        position: "Developer",
        startDate: "Aug 2021",
        endDate: "Jun 2022",
        description: [],
      },
    ],
  },
  {
    company: {
      name: "AroFlo",
      linkedInUrl: "https://www.linkedin.com/company/aroflo",
    },
    positions: [
      {
        position: "Web Developer",
        startDate: "Aug 2019",
        endDate: "Sept 2021",
        description: [
          "Working as a full stack developer. Delivering new features to AroFlo Platform which is an industry leading product in Australia, my current main involves in the platform include but not limited to project management, quotes, invoices, payment integration areas.",
        ],
      },
    ],
  },
  {
    company: {
      name: "PTEPLUS",
    },
    positions: [
      {
        position: "Development Lead",
        startDate: "Jan 2018",
        endDate: "May 2019",
        description: [
          "Work with the dev team on two main products. Design and implement IT architecture on the clouding computing platforms (AWS and Aliyun). Deliver stable, rapid responsible and reliable web applications to product's users.",
        ],
      },
      {
        position: "Full Stack Developer",
        startDate: "Oct 2016",
        endDate: "Jan 2018",
        description: [
          "One of the key contributors to the start-up company, and participated in almost every stage of product design, implement and testing. Took responsibilities on full solutions to the technical side such as coding and servers' setup.",
        ],
      },
    ],
  },
];


