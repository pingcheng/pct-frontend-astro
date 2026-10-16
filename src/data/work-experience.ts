export type DescriptionLine =
  | { type: "text"; text: string }
  | { type: "bullet"; text: string }
  | { type: "heading"; text: string }
  | { type: "break" };

export type WorkPosition = {
  position: string;
  startDate: string;
  endDate: string;
  description?: DescriptionLine[];
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
      },
      {
        position: "Staff Engineer",
        startDate: "July 2025",
        endDate: "Jan 2026",
      },
      {
        position: "Lead Developer",
        startDate: "Aug 2024",
        endDate: "July 2025",
      },
      {
        position: "Senior Developer",
        startDate: "Jul 2022",
        endDate: "Aug 2024",
        description: [
          { type: "text", text: "Highly involved in digital mortgage areas, seamlessly connecting banks and the valuation industry with modern digital solutions. Contributing to the development of secure, enterprise-level products." },
          { type: "break" },
          { type: "heading", text: "Key Responsibilities:" },
          { type: "bullet", text: "Collaborate closely with the lead developer to design system solutions." },
          { type: "bullet", text: "Utilise existing group-wide infrastructure to optimise efficiency and avoid redundancy." },
          { type: "bullet", text: "Take the lead in developing feature slices and efficiently allocate work within the team." },
          { type: "bullet", text: "Provide mentorship to less experienced developers within the team." },
        ],
      },
      {
        position: "Developer",
        startDate: "Aug 2021",
        endDate: "Jun 2022",
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
          { type: "text", text: "Worked as a full-stack developer, delivering new features for the AroFlo platform, an industry-leading product in Australia. Main areas of work included project management, quotes, invoices and payment integration." },
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
          { type: "text", text: "Worked with the development team on two main products. Designed and implemented IT architecture on cloud computing platforms (AWS and Aliyun). Delivered stable, responsive and reliable web applications to users." },
        ],
      },
      {
        position: "Full Stack Developer",
        startDate: "Oct 2016",
        endDate: "Jan 2018",
        description: [
          { type: "text", text: "One of the key contributors to the start-up company, participating in almost every stage of product design, implementation and testing. Took responsibility for technical solutions, including coding and server setup." },
        ],
      },
    ],
  },
];
