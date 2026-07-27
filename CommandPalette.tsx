import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { getDB, saveDB, User, Profile, Job, Application, Notification, ActivityLog } from "./src/db_store.js";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, running in AI local-matching mode.");
}

// Simple Helper to generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}

// Middleware: Authenticated User Simulation from Headers (for mock simplicity with SaaS precision)
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const db = getDB();
    // Simulate token verification (token will be equal to user.id in our simple jwt simulation)
    const user = db.users.find((u) => u.id === token);
    if (user) {
      (req as any).user = user;
    }
  }
  next();
});

// Require Auth Guard
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }
  next();
}

// Require Role Guard
function requireRole(roles: Array<"student" | "recruiter" | "admin">) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: `Forbidden. Requires one of these roles: ${roles.join(", ")}` });
    }
    next();
  };
}

// Logging helper
function logActivity(userId: string, userName: string, action: string, details: string) {
  const db = getDB();
  const log: ActivityLog = {
    id: generateId("act"),
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  db.activityLogs.unshift(log);
  // Keep logs at a reasonable limit
  if (db.activityLogs.length > 100) {
    db.activityLogs = db.activityLogs.slice(0, 100);
  }
  saveDB(db);
}

// Notification helper
function createNotification(userId: string, title: string, message: string, type: "info" | "success" | "warning" | "alert" = "info") {
  const db = getDB();
  const ntf: Notification = {
    id: generateId("ntf"),
    userId,
    title,
    message,
    read: false,
    type,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(ntf);
  saveDB(db);
}

// ==========================================
// AUTHENTICATION APIs
// ==========================================

app.post("/api/auth/register", (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const db = getDB();
  const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const userId = generateId("usr");
  const newUser: User = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash: password, // For simplicity we store password directly
    name,
    role,
    profileCompletePercent: role === "student" ? 20 : 100,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // If role is student, initialize an empty profile
  if (role === "student") {
    const newProfile: Profile = {
      userId,
      personalDetails: {
        name,
        email: email.toLowerCase(),
        phone: "",
        location: "",
        title: "",
        bio: ""
      },
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      experience: [],
      githubUrl: "",
      linkedinUrl: "",
    };
    db.profiles.push(newProfile);
  }

  saveDB(db);
  logActivity(userId, name, "USER_REGISTER", `Registered a new ${role} account.`);
  createNotification(userId, "Welcome aboard!", `Welcome to RESUMESCREENING, ${name}! Complete your settings to get started.`, "success");

  res.status(201).json({
    token: userId,
    user: {
      id: userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profileCompletePercent: newUser.profileCompletePercent,
      avatarUrl: newUser.avatarUrl
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const db = getDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  logActivity(user.id, user.name, "USER_LOGIN", `Logged into the system.`);

  res.json({
    token: user.id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileCompletePercent: user.profileCompletePercent,
      avatarUrl: user.avatarUrl
    }
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    profileCompletePercent: user.profileCompletePercent,
    avatarUrl: user.avatarUrl
  });
});

app.post("/api/auth/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = (req as any).user;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new passwords are required." });
  }

  const db = getDB();
  const dbUser = db.users.find((u) => u.id === user.id);
  if (!dbUser || dbUser.passwordHash !== currentPassword) {
    return res.status(400).json({ error: "Incorrect current password." });
  }

  dbUser.passwordHash = newPassword;
  saveDB(db);

  logActivity(user.id, user.name, "PASSWORD_CHANGE", "Password updated successfully.");
  createNotification(user.id, "Security Alert", "Your password has been changed recently.", "warning");

  res.json({ message: "Password updated successfully." });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  const db = getDB();
  const exists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    return res.status(404).json({ error: "No account found with this email." });
  }

  // In a mock server we immediately complete or send a simulation
  res.json({ message: "Reset instructions have been sent to your email. Check your inbox!" });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { email, tempToken, newPassword } = req.body;
  if (!email || !tempToken || !newPassword) {
    return res.status(400).json({ error: "All arguments are required." });
  }
  const db = getDB();
  const dbUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!dbUser) {
    return res.status(404).json({ error: "User not found." });
  }

  dbUser.passwordHash = newPassword;
  saveDB(db);
  res.json({ message: "Your password has been reset successfully. Please log in." });
});

// ==========================================
// STUDENT PROFILE APIs
// ==========================================

app.get("/api/profile", requireAuth, requireRole(["student"]), (req, res) => {
  const user = (req as any).user;
  const db = getDB();
  let profile = db.profiles.find((p) => p.userId === user.id);
  if (!profile) {
    // Lazy initialize if missing
    profile = {
      userId: user.id,
      personalDetails: { name: user.name, email: user.email, phone: "", location: "", title: "", bio: "" },
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      experience: [],
      githubUrl: "",
      linkedinUrl: ""
    };
    db.profiles.push(profile);
    saveDB(db);
  }
  res.json(profile);
});

app.put("/api/profile", requireAuth, requireRole(["student"]), (req, res) => {
  const user = (req as any).user;
  const updatedProfile: Profile = req.body;
  const db = getDB();

  const idx = db.profiles.findIndex((p) => p.userId === user.id);
  if (idx === -1) {
    updatedProfile.userId = user.id;
    db.profiles.push(updatedProfile);
  } else {
    db.profiles[idx] = { ...db.profiles[idx], ...updatedProfile, userId: user.id };
  }

  // Calculate profile completion percent
  let score = 20; // Default for account activation
  const p = db.profiles[idx === -1 ? db.profiles.length - 1 : idx];
  if (p.personalDetails.phone) score += 10;
  if (p.personalDetails.location) score += 10;
  if (p.personalDetails.bio) score += 10;
  if (p.education && p.education.length > 0) score += 15;
  if (p.skills && p.skills.length > 0) score += 15;
  if (p.projects && p.projects.length > 0) score += 10;
  if (p.experience && p.experience.length > 0) score += 10;

  score = Math.min(score, 100);

  const dbUser = db.users.find((u) => u.id === user.id);
  if (dbUser) {
    dbUser.profileCompletePercent = score;
  }

  saveDB(db);
  logActivity(user.id, user.name, "PROFILE_UPDATE", "Updated details in profile wizard.");

  res.json({ message: "Profile saved successfully.", score });
});

// ==========================================
// RESUME PARSING AND SCREENING ENGINE
// ==========================================

// Parse plain text or file metadata to generate structured parsing data
async function parseResumeText(resumeText: string, filename: string): Promise<any> {
  const commonSuggestions = [
    `List Spring Boot projects inside your experience summary to grab recruiters' attention.`,
    `Incorporate GitHub source control links for your projects to validate technical code structure.`,
    `Detail your SQL normalization techniques when discussing backend experience in ${filename}.`,
    `Mention RESTful API status codes validation in your projects section.`
  ];

  if (ai) {
    try {
      const prompt = `Parse the following candidate resume text into a standard enterprise profile parsing format. 
      Analyze the candidate's skills, qualifications, certifications, projects, and work history.
      Format the output strictly as a JSON object with properties:
      - score (integer 0 to 100, representing overall strength)
      - skills (array of strings, extracted technical & soft skills)
      - education (array of strings, schools/degrees)
      - projects (array of strings, major projects)
      - certifications (array of strings, major certificates)
      - experience (array of strings, job history titles/roles)
      - missingSkills (array of strings, high-demand industry skills that are missing like Spring Security, Docker, Redis, Kubernetes, AWS, etc.)
      - suggestions (array of 4 highly actionable resume improvement tips)

      Resume Text:
      "${resumeText}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              education: { type: Type.ARRAY, items: { type: Type.STRING } },
              projects: { type: Type.ARRAY, items: { type: Type.STRING } },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              experience: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "skills", "education", "projects", "certifications", "experience", "missingSkills", "suggestions"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      return data;
    } catch (err) {
      console.error("Gemini call failed during parsing, falling back to local engine:", err);
    }
  }

  // Smart local matching algorithm as reliable offline fallback
  const textLower = resumeText.toLowerCase();
  const allSkills = [
    "Java", "Spring Boot", "Spring Security", "MySQL", "React", "TypeScript", "Tailwind CSS",
    "Docker", "Kubernetes", "Redis", "Kafka", "AWS", "Git", "REST APIs", "Python", "JavaScript",
    "PostgreSQL", "Recharts", "Node.js", "Express", "Microservices"
  ];

  const matchedSkills: string[] = [];
  allSkills.forEach(s => {
    if (textLower.includes(s.toLowerCase())) {
      matchedSkills.push(s);
    }
  });

  // Guarantee at least some base skills if text is small
  if (matchedSkills.length === 0) {
    matchedSkills.push("Java", "MySQL", "Git");
  }

  const missingSkills = allSkills.filter(s => !matchedSkills.includes(s)).slice(0, 4);
  const calculatedScore = Math.min(50 + (matchedSkills.length * 5), 98);

  const parsedData = {
    score: calculatedScore,
    skills: matchedSkills,
    education: textLower.includes("university") || textLower.includes("college") 
      ? ["Bachelor of Science in Computer Engineering"]
      : ["High School Diploma / Tech Certification Bootcamp"],
    projects: textLower.includes("project")
      ? ["Enterprise Dashboard Management Portal"]
      : ["Personal Code Repository Portfolio"],
    certifications: textLower.includes("cert")
      ? ["Certified Developer Specialist"]
      : ["Udemy Professional Java Development Certification"],
    experience: textLower.includes("work") || textLower.includes("engineer") || textLower.includes("developer")
      ? ["Junior Web Application Developer"]
      : ["Freelance Code Developer"],
    missingSkills: missingSkills,
    suggestions: [
      `Add more detailed metrics (e.g. 'boosted speeds by 30%') to your project bullet points.`,
      `Consider obtaining a cloud certification (AWS, Google Cloud, Azure) to complement your backend Java skills.`,
      `Include experience with microservices structures and message brokers like Kafka.`,
      `Add links to your live deployment websites or detailed project GitHub repos.`
    ]
  };

  return parsedData;
}

app.post("/api/resume/upload", requireAuth, requireRole(["student"]), async (req, res) => {
  const { filename, fileContentText } = req.body;
  const user = (req as any).user;

  if (!filename || !fileContentText) {
    return res.status(400).json({ error: "Filename and file text content are required." });
  }

  const db = getDB();
  const profileIdx = db.profiles.findIndex((p) => p.userId === user.id);
  if (profileIdx === -1) {
    return res.status(404).json({ error: "Profile not found." });
  }

  try {
    // Generate AI Parser report
    const parsedData = await parseResumeText(fileContentText, filename);

    // Update profile
    db.profiles[profileIdx].resumeUrl = `/uploads/${filename}`;
    db.profiles[profileIdx].resumeFilename = filename;
    db.profiles[profileIdx].resumeParsedData = parsedData;

    // Push new skills found in resume to user skills if missing
    const mergedSkills = Array.from(new Set([...(db.profiles[profileIdx].skills || []), ...parsedData.skills]));
    db.profiles[profileIdx].skills = mergedSkills;

    // Boost profile completion
    db.users.forEach((u) => {
      if (u.id === user.id) {
        u.profileCompletePercent = Math.min(100, Math.max(u.profileCompletePercent, 90));
      }
    });

    saveDB(db);

    logActivity(user.id, user.name, "RESUME_UPLOAD", `Uploaded and screened ${filename}. Resume score: ${parsedData.score}%`);
    createNotification(user.id, "AI Analysis Completed", `Your resume ${filename} was parsed successfully. Score: ${parsedData.score}%`, "success");

    res.json({
      message: "Resume uploaded and screened successfully!",
      resumeFilename: filename,
      parsedData
    });
  } catch (err) {
    console.error("Resume analysis crashed:", err);
    res.status(500).json({ error: "Resume analysis failed. Please try again." });
  }
});

app.delete("/api/resume", requireAuth, requireRole(["student"]), (req, res) => {
  const user = (req as any).user;
  const db = getDB();
  const idx = db.profiles.findIndex((p) => p.userId === user.id);
  if (idx !== -1) {
    db.profiles[idx].resumeUrl = undefined;
    db.profiles[idx].resumeFilename = undefined;
    db.profiles[idx].resumeParsedData = undefined;
    saveDB(db);
    logActivity(user.id, user.name, "RESUME_DELETE", "Deleted current resume file.");
    res.json({ message: "Resume deleted successfully." });
  } else {
    res.status(404).json({ error: "Profile not found." });
  }
});

// ==========================================
// JOB MANAGEMENT APIs
// ==========================================

app.get("/api/jobs", (req, res) => {
  const db = getDB();
  res.json(db.jobs);
});

app.post("/api/jobs", requireAuth, requireRole(["recruiter", "admin"]), (req, res) => {
  const { title, description, requiredSkills, salary, experience, location, deadline } = req.body;
  const user = (req as any).user;

  if (!title || !description || !requiredSkills || !salary || !experience || !location || !deadline) {
    return res.status(400).json({ error: "All job fields are required." });
  }

  const db = getDB();
  const newJob: Job = {
    id: generateId("job"),
    title,
    description,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(",").map((s: string) => s.trim()),
    salary,
    experience,
    location,
    deadline,
    status: "open",
    recruiterId: user.id,
    recruiterName: user.name,
    createdAt: new Date().toISOString()
  };

  db.jobs.unshift(newJob);
  saveDB(db);

  logActivity(user.id, user.name, "JOB_CREATION", `Created new job: ${title}`);
  
  // Notify all students
  db.users.filter(u => u.role === "student").forEach(student => {
    createNotification(student.id, "New Job Matching Your Field", `A new role '${title}' is open. Check details now!`, "info");
  });

  res.status(201).json(newJob);
});

app.put("/api/jobs/:id", requireAuth, requireRole(["recruiter", "admin"]), (req, res) => {
  const { id } = req.params;
  const { title, description, requiredSkills, salary, experience, location, deadline, status } = req.body;
  const user = (req as any).user;

  const db = getDB();
  const jobIdx = db.jobs.findIndex((j) => j.id === id);
  if (jobIdx === -1) {
    return res.status(404).json({ error: "Job listing not found." });
  }

  // Ensure only owning recruiter or admin can edit
  const job = db.jobs[jobIdx];
  if (job.recruiterId !== user.id && user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized. You did not create this job." });
  }

  db.jobs[jobIdx] = {
    ...job,
    title: title || job.title,
    description: description || job.description,
    requiredSkills: requiredSkills 
      ? (Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(",").map((s: string) => s.trim()))
      : job.requiredSkills,
    salary: salary || job.salary,
    experience: experience || job.experience,
    location: location || job.location,
    deadline: deadline || job.deadline,
    status: status || job.status,
  };

  saveDB(db);
  logActivity(user.id, user.name, "JOB_EDIT", `Modified job details: ${db.jobs[jobIdx].title}`);
  res.json(db.jobs[jobIdx]);
});

app.delete("/api/jobs/:id", requireAuth, requireRole(["recruiter", "admin"]), (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  const db = getDB();
  const idx = db.jobs.findIndex((j) => j.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Job not found." });
  }

  const job = db.jobs[idx];
  if (job.recruiterId !== user.id && user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized." });
  }

  db.jobs.splice(idx, 1);
  saveDB(db);
  logActivity(user.id, user.name, "JOB_DELETE", `Deleted job: ${job.title}`);
  res.json({ message: "Job listing deleted successfully." });
});

// GET job recommendation with exact matching score calculations
app.get("/api/jobs/recommend", requireAuth, requireRole(["student"]), (req, res) => {
  const user = (req as any).user;
  const db = getDB();
  const profile = db.profiles.find((p) => p.userId === user.id);

  if (!profile || !profile.skills || profile.skills.length === 0) {
    // Return all open jobs with a baseline score
    const result = db.jobs.filter(j => j.status === "open").map(job => ({
      ...job,
      matchScore: 60,
      missingSkills: job.requiredSkills,
      readiness: "Medium"
    }));
    return res.json(result);
  }

  const studentSkillsLower = profile.skills.map((s) => s.toLowerCase());

  const recommendations = db.jobs
    .filter((j) => j.status === "open")
    .map((job) => {
      const required = job.requiredSkills || [];
      if (required.length === 0) {
        return { ...job, matchScore: 100, missingSkills: [], readiness: "Excellent" };
      }

      const matched = required.filter((skill) => studentSkillsLower.includes(skill.toLowerCase()));
      const missing = required.filter((skill) => !studentSkillsLower.includes(skill.toLowerCase()));
      const matchScore = Math.round((matched.length / required.length) * 100);

      let readiness = "Needs Skill Upgrading";
      if (matchScore >= 80) readiness = "Excellent Fit";
      else if (matchScore >= 60) readiness = "Strong Fit";
      else if (matchScore >= 40) readiness = "Moderate Match";

      return {
        ...job,
        matchScore,
        missingSkills: missing,
        readiness
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json(recommendations);
});

// ==========================================
// APPLICATION TRACKING SYSTEM APIs
// ==========================================

app.get("/api/applications", requireAuth, (req, res) => {
  const user = (req as any).user;
  const db = getDB();

  if (user.role === "student") {
    const apps = db.applications.filter((a) => a.studentId === user.id);
    res.json(apps);
  } else if (user.role === "recruiter") {
    // Recruiter only sees applications for jobs they posted
    const recruiterJobIds = db.jobs.filter((j) => j.recruiterId === user.id).map((j) => j.id);
    const apps = db.applications.filter((a) => recruiterJobIds.includes(a.jobId));
    res.json(apps);
  } else {
    // Admin sees all
    res.json(db.applications);
  }
});

app.post("/api/applications", requireAuth, requireRole(["student"]), (req, res) => {
  const { jobId } = req.body;
  const user = (req as any).user;

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required." });
  }

  const db = getDB();
  const job = db.jobs.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found." });
  }

  // Prevent double application
  const alreadyApplied = db.applications.some((a) => a.jobId === jobId && a.studentId === user.id);
  if (alreadyApplied) {
    return res.status(400).json({ error: "You have already applied to this job listing." });
  }

  const profile = db.profiles.find((p) => p.userId === user.id);
  const resumeScore = profile?.resumeParsedData?.score || 65;

  // Calculate Match Score
  const required = job.requiredSkills || [];
  const candidateSkills = profile?.skills || [];
  const matched = required.filter(skill => candidateSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()));
  const matchScore = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 70;

  const newApp: Application = {
    id: generateId("app"),
    jobId,
    jobTitle: job.title,
    studentId: user.id,
    studentName: user.name,
    studentEmail: user.email,
    resumeScore,
    matchScore,
    experienceScore: profile?.experience && profile.experience.length > 0 ? 85 : 55,
    status: "applied",
    timeline: [
      {
        status: "applied",
        date: new Date().toISOString(),
        comment: "Application submitted. Automated screening engine registered skills match."
      }
    ],
    createdAt: new Date().toISOString()
  };

  db.applications.push(newApp);
  saveDB(db);

  logActivity(user.id, user.name, "JOB_APPLICATION", `Applied for '${job.title}'`);
  createNotification(job.recruiterId, "New Applicant Added", `${user.name} applied for your opening '${job.title}' with a match score of ${matchScore}%`, "info");
  createNotification(user.id, "Application Submitted", `Successfully applied to '${job.title}'! Track your timeline here.`, "success");

  res.status(201).json(newApp);
});

app.put("/api/applications/:id/status", requireAuth, requireRole(["recruiter", "admin"]), (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;
  const user = (req as any).user;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  const db = getDB();
  const appIdx = db.applications.findIndex((a) => a.id === id);
  if (appIdx === -1) {
    return res.status(404).json({ error: "Application tracking entry not found." });
  }

  const application = db.applications[appIdx];
  application.status = status;
  application.timeline.push({
    status,
    date: new Date().toISOString(),
    comment: comment || `Application status transitioned to '${status}' by recruiter.`
  });

  saveDB(db);

  // Notify student
  let notificationType: "info" | "success" | "warning" | "alert" = "info";
  if (status === "selected" || status === "shortlisted") notificationType = "success";
  if (status === "rejected") notificationType = "alert";

  createNotification(
    application.studentId,
    `Application Status Update`,
    `Your application for '${application.jobTitle}' is now: ${status.replace("_", " ").toUpperCase()}`,
    notificationType
  );

  logActivity(user.id, user.name, "APPLICATION_STATUS_UPDATE", `Updated candidate application ${id} to ${status}`);

  res.json(application);
});

// Bulk status update for recruitment pipelines
app.post("/api/applications/bulk-status", requireAuth, requireRole(["recruiter", "admin"]), (req, res) => {
  const { ids, status, comment } = req.body;
  const user = (req as any).user;

  if (!ids || !Array.isArray(ids) || !status) {
    return res.status(400).json({ error: "Invalid parameters." });
  }

  const db = getDB();
  let updatedCount = 0;

  db.applications.forEach((app) => {
    if (ids.includes(app.id)) {
      app.status = status;
      app.timeline.push({
        status,
        date: new Date().toISOString(),
        comment: comment || `Bulk update transition to '${status}' by recruiter.`
      });
      updatedCount++;

      createNotification(
        app.studentId,
        `Application Status Update`,
        `Your application for '${app.jobTitle}' has been updated to: ${status.toUpperCase()}`,
        "info"
      );
    }
  });

  saveDB(db);
  logActivity(user.id, user.name, "BULK_STATUS_UPDATE", `Updated ${updatedCount} applications to ${status}`);
  res.json({ message: `Successfully updated ${updatedCount} applications.` });
});

// ==========================================
// NOTIFICATIONS SYSTEM APIs
// ==========================================

app.get("/api/notifications", requireAuth, (req, res) => {
  const user = (req as any).user;
  const db = getDB();
  const userNotifications = db.notifications.filter((n) => n.userId === user.id);
  res.json(userNotifications);
});

app.post("/api/notifications/read-all", requireAuth, (req, res) => {
  const user = (req as any).user;
  const db = getDB();
  db.notifications.forEach((n) => {
    if (n.userId === user.id) {
      n.read = true;
    }
  });
  saveDB(db);
  res.json({ message: "All notifications marked as read." });
});

// ==========================================
// ADMIN DASHBOARD & USER MANAGEMENT
// ==========================================

app.get("/api/users", requireAuth, requireRole(["admin"]), (req, res) => {
  const db = getDB();
  res.json(db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    profileCompletePercent: u.profileCompletePercent,
    createdAt: u.createdAt
  })));
});

app.delete("/api/users/:id", requireAuth, requireRole(["admin"]), (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;

  if (id === user.id) {
    return res.status(400).json({ error: "You cannot delete your own admin account." });
  }

  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "User not found." });
  }

  const deletedUser = db.users[idx];
  db.users.splice(idx, 1);

  // Clean profiles and applications
  db.profiles = db.profiles.filter(p => p.userId !== id);
  db.applications = db.applications.filter(a => a.studentId !== id);

  saveDB(db);
  logActivity(user.id, user.name, "USER_DELETE", `Admin deleted account: ${deletedUser.name} (${deletedUser.role})`);
  res.json({ message: "User deleted successfully." });
});

app.get("/api/activity-logs", requireAuth, requireRole(["admin", "recruiter"]), (req, res) => {
  const db = getDB();
  res.json(db.activityLogs);
});

// ==========================================
// VITE DEV SERVER / PRODUCTION SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RESUMESCREENING Backend server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
