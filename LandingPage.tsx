import fs from "fs";
import path from "path";

export interface User {
  id: string;
  email: string;
  passwordHash: string; // "password" for mock, but we can do simple compare
  name: string;
  role: "student" | "recruiter" | "admin";
  profileCompletePercent: number;
  avatarUrl: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    bio: string;
  };
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
  }>;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: string[];
  experience: Array<{
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl?: string;
  resumeFilename?: string;
  resumeParsedData?: {
    score: number;
    skills: string[];
    education: string[];
    projects: string[];
    certifications: string[];
    experience: string[];
    missingSkills: string[];
    suggestions: string[];
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  salary: string;
  experience: string;
  location: string;
  deadline: string;
  status: "open" | "closed";
  recruiterId: string;
  recruiterName: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  resumeScore: number;
  matchScore: number;
  experienceScore: number;
  status: "applied" | "under_review" | "shortlisted" | "interview_scheduled" | "rejected" | "selected";
  timeline: Array<{
    status: string;
    date: string;
    comment: string;
  }>;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning" | "alert";
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DBState {
  users: User[];
  profiles: Profile[];
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
}

const STORE_PATH = path.join(process.cwd(), "db_store.json");

const initialData: DBState = {
  users: [
    {
      id: "usr_student",
      email: "student@resumescreening.ai",
      passwordHash: "password",
      name: "Irfan Khan",
      role: "student",
      profileCompletePercent: 85,
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Irfan",
      createdAt: "2026-06-01T10:00:00Z"
    },
    {
      id: "usr_recruiter",
      email: "recruiter@resumescreening.ai",
      passwordHash: "password",
      name: "Sarah Jenkins",
      role: "recruiter",
      profileCompletePercent: 100,
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
      createdAt: "2026-05-15T09:30:00Z"
    },
    {
      id: "usr_admin",
      email: "admin@resumescreening.ai",
      passwordHash: "password",
      name: "Alex Carter",
      role: "admin",
      profileCompletePercent: 100,
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
      createdAt: "2026-05-01T08:00:00Z"
    }
  ],
  profiles: [
    {
      userId: "usr_student",
      personalDetails: {
        name: "Irfan Khan",
        email: "student@resumescreening.ai",
        phone: "+1 (555) 019-2834",
        location: "San Francisco, CA",
        title: "Full Stack Java Developer",
        bio: "Passionate Computer Science graduate specializing in enterprise Java applications, microservices, and modern frontend frameworks like React. Focused on building clean, modular SaaS solutions."
      },
      education: [
        {
          school: "Stanford University",
          degree: "MS",
          field: "Computer Science",
          startYear: "2024",
          endYear: "2026"
        },
        {
          school: "UC Berkeley",
          degree: "BS",
          field: "Computer Engineering",
          startYear: "2020",
          endYear: "2024"
        }
      ],
      skills: ["Java", "Spring Boot", "MySQL", "React", "TypeScript", "Tailwind CSS", "REST APIs", "Git", "Docker"],
      projects: [
        {
          title: "SaaS Analytics Engine",
          description: "Built a real-time event analytics processor using Spring Boot, React, and MySQL. Implemented responsive recharts dashboards and complex filtering.",
          technologies: ["Java", "Spring Boot", "React", "MySQL", "Recharts"],
          link: "https://github.com/irfankhan/analytics-engine"
        },
        {
          title: "Cloud Resume Parser",
          description: "Designed a text parsing and matching pipeline with JWT security, Docker deployment, and AI-assisted categorization.",
          technologies: ["Java", "Spring Boot", "Docker", "REST APIs"],
          link: "https://github.com/irfankhan/cloud-parser"
        }
      ],
      certifications: ["Oracle Certified Java Professional", "AWS Certified Solutions Architect"],
      experience: [
        {
          company: "Stripe",
          role: "Software Engineer Intern",
          location: "San Francisco, CA",
          startDate: "2025-05",
          endDate: "2025-08",
          current: false,
          description: "Worked with the core billing team to develop high-throughput API endpoints. Optimized SQL queries, decreasing latency by 14%. Implemented custom dashboards in React."
        }
      ],
      githubUrl: "https://github.com/irfankhan",
      linkedinUrl: "https://linkedin.com/in/irfankhan",
      resumeUrl: "/uploads/resume_irfan_khan.pdf",
      resumeFilename: "irfan_khan_resume.pdf",
      resumeParsedData: {
        score: 82,
        skills: ["Java", "Spring Boot", "MySQL", "React", "TypeScript", "Tailwind CSS", "REST APIs"],
        education: ["MS in Computer Science - Stanford University", "BS in Computer Engineering - UC Berkeley"],
        projects: ["SaaS Analytics Engine", "Cloud Resume Parser"],
        certifications: ["Oracle Certified Java Professional", "AWS Certified Solutions Architect"],
        experience: ["Software Engineer Intern at Stripe"],
        missingSkills: ["Docker", "Kubernetes", "Redis", "Spring Security"],
        suggestions: [
          "Add Docker and Spring Security to your skills matrix as they are in high demand for enterprise Java roles.",
          "Add a GitHub Portfolio Link to your primary header.",
          "Expand your Stripe Experience with detailed bullet points on Java development and Spring Boot integration.",
          "Include a project demonstrating Docker and microservices orchestration."
        ]
      }
    }
  ],
  jobs: [
    {
      id: "job_001",
      title: "Senior Full Stack Engineer (Java + React)",
      description: "Join our core payments experience team. You will lead the development of our high-volume merchant dashboard, build secure Spring Boot microservices, and design interactive React analytical panels.\n\nKey Responsibilities:\n- Architect modular Java web services.\n- Lead transitions from legacy dashboards to React-based fluid visual charts.\n- Optimize PostgreSQL queries and Redis caching layers.",
      requiredSkills: ["Java", "Spring Boot", "React", "PostgreSQL", "Redis", "REST APIs", "TypeScript"],
      salary: "$140,000 - $170,000",
      experience: "5+ years",
      location: "San Francisco, CA (Hybrid)",
      deadline: "2026-08-30",
      status: "open",
      recruiterId: "usr_recruiter",
      recruiterName: "Sarah Jenkins",
      createdAt: "2026-07-01T08:00:00Z"
    },
    {
      id: "job_002",
      title: "Enterprise Software Engineer",
      description: "We are seeking a high-caliber Java engineer to scale our business automation tool. You will build bulletproof APIs and work with cloud architectures.\n\nQualifications:\n- Strong foundation in Java and Spring Security.\n- Experience with relational databases like MySQL/Oracle.\n- Comfortable with containerization (Docker).",
      requiredSkills: ["Java", "Spring Boot", "Spring Security", "MySQL", "Docker", "REST APIs"],
      salary: "$110,000 - $135,000",
      experience: "2+ years",
      location: "Austin, TX (Remote)",
      deadline: "2026-08-15",
      status: "open",
      recruiterId: "usr_recruiter",
      recruiterName: "Sarah Jenkins",
      createdAt: "2026-07-05T09:00:00Z"
    },
    {
      id: "job_003",
      title: "React Frontend Developer (SaaS Dashboard)",
      description: "Are you an expert in Tailwind, React, and Recharts? We need you to craft pixel-perfect interactive SaaS interfaces with rich animations.\n\nRequirements:\n- Proficient in React, TypeScript, and Tailwind CSS.\n- Familiarity with Framer Motion and modern visual designs.",
      requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Framer Motion", "Figma"],
      salary: "$100,000 - $125,000",
      experience: "1-3 years",
      location: "New York, NY (Onsite)",
      deadline: "2026-08-20",
      status: "open",
      recruiterId: "usr_recruiter",
      recruiterName: "Sarah Jenkins",
      createdAt: "2026-07-10T11:30:00Z"
    },
    {
      id: "job_004",
      title: "Cloud DevOps Architect",
      description: "Help automate and build resilient containerized deployment orchestrations across AWS clusters.\n\nRequired:\n- Docker, Kubernetes, Terraform, AWS CI/CD pipelines.",
      requiredSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux"],
      salary: "$150,000 - $180,000",
      experience: "4+ years",
      location: "Seattle, WA (Remote)",
      deadline: "2026-09-10",
      status: "open",
      recruiterId: "usr_recruiter",
      recruiterName: "Sarah Jenkins",
      createdAt: "2026-07-12T14:15:00Z"
    },
    {
      id: "job_005",
      title: "Backend Java Specialist (Closed Role)",
      description: "Enterprise data integration systems using Spring Boot and Kafka. (Note: This position has been successfully filled and is shown for record tracking).",
      requiredSkills: ["Java", "Spring Boot", "Kafka", "MySQL"],
      salary: "$120,000 - $145,000",
      experience: "3+ years",
      location: "Chicago, IL",
      deadline: "2026-07-05",
      status: "closed",
      recruiterId: "usr_recruiter",
      recruiterName: "Sarah Jenkins",
      createdAt: "2026-06-15T09:00:00Z"
    }
  ],
  applications: [
    {
      id: "app_001",
      jobId: "job_001",
      jobTitle: "Senior Full Stack Engineer (Java + React)",
      studentId: "usr_student",
      studentName: "Irfan Khan",
      studentEmail: "student@resumescreening.ai",
      resumeScore: 82,
      matchScore: 85,
      experienceScore: 80,
      status: "interview_scheduled",
      timeline: [
        { status: "applied", date: "2026-07-02T10:30:00Z", comment: "Application successfully submitted with resume." },
        { status: "under_review", date: "2026-07-04T14:20:00Z", comment: "Screener passed. Resume score matched required benchmark." },
        { status: "shortlisted", date: "2026-07-06T09:15:00Z", comment: "Shortlisted based on strong Java + React credentials." },
        { status: "interview_scheduled", date: "2026-07-10T16:00:00Z", comment: "Technical interview scheduled for July 18th, 2026 at 2 PM PST." }
      ],
      createdAt: "2026-07-02T10:30:00Z"
    },
    {
      id: "app_002",
      jobId: "job_002",
      jobTitle: "Enterprise Software Engineer",
      studentId: "usr_student",
      studentName: "Irfan Khan",
      studentEmail: "student@resumescreening.ai",
      resumeScore: 82,
      matchScore: 92,
      experienceScore: 85,
      status: "shortlisted",
      timeline: [
        { status: "applied", date: "2026-07-06T11:00:00Z", comment: "Application submitted via SaaS EasyApply." },
        { status: "under_review", date: "2026-07-08T15:30:00Z", comment: "Skills matching verified. Candidate scored high on Java & Spring Boot parameters." },
        { status: "shortlisted", date: "2026-07-12T10:00:00Z", comment: "Recommended for immediate review by HR Lead." }
      ],
      createdAt: "2026-07-06T11:00:00Z"
    }
  ],
  notifications: [
    {
      id: "ntf_001",
      userId: "usr_student",
      title: "Interview Scheduled",
      message: "Congratulations! Your technical interview for Senior Full Stack Engineer (Java + React) has been scheduled.",
      read: false,
      type: "success",
      createdAt: "2026-07-10T16:05:00Z"
    },
    {
      id: "ntf_002",
      userId: "usr_student",
      title: "Application Shortlisted",
      message: "You have been shortlisted for the Enterprise Software Engineer position.",
      read: false,
      type: "info",
      createdAt: "2026-07-12T10:02:00Z"
    },
    {
      id: "ntf_003",
      userId: "usr_recruiter",
      title: "New Applicant Alert",
      message: "Irfan Khan applied for Senior Full Stack Engineer (Java + React) with an 82% resume match score.",
      read: false,
      type: "info",
      createdAt: "2026-07-02T10:31:00Z"
    }
  ],
  activityLogs: [
    {
      id: "act_001",
      userId: "usr_student",
      userName: "Irfan Khan",
      action: "RESUME_UPLOAD",
      details: "Uploaded irfan_khan_resume.pdf. AI Analysis generated a score of 82%.",
      timestamp: "2026-07-01T15:20:00Z"
    },
    {
      id: "act_002",
      userId: "usr_student",
      userName: "Irfan Khan",
      action: "JOB_APPLICATION",
      details: "Applied for Senior Full Stack Engineer (Java + React).",
      timestamp: "2026-07-02T10:30:00Z"
    },
    {
      id: "act_003",
      userId: "usr_recruiter",
      userName: "Sarah Jenkins",
      action: "JOB_CREATION",
      details: "Created job 'React Frontend Developer (SaaS Dashboard)' with 6 required skills.",
      timestamp: "2026-07-10T11:30:00Z"
    }
  ]
};

export function getDB(): DBState {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read DB store, using in-memory initialization.", err);
    return initialData;
  }
}

export function saveDB(state: DBState): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to DB store.", err);
  }
}
