import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for candidate data
const candidateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      period: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string(),
    }),
  ),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
})

// Define the schema for the match analysis
const matchAnalysisSchema = z.object({
  candidateData: candidateSchema,
  matchScore: z.number().min(0).max(100),
  matchDetails: z.object({
    skillsMatch: z.number().min(0).max(100),
    experienceMatch: z.number().min(0).max(100),
    educationMatch: z.number().min(0).max(100),
  }),
})

export async function analyzeResume(resumeText: string, jobId: string) {
  try {
    // In a real application, you would fetch the job description from your database
    // For this example, we'll use a mock job description
    const jobDescription = getMockJobDescription(jobId)

    // Use the AI SDK to analyze the resume and match against the job description
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: matchAnalysisSchema,
      prompt: `
        You are a Recruiting Agent. Your task is to analyze the following resume/CV and match it against
        a job description to determine how well the candidate fits the role.
        
        Resume/CV:
        ${resumeText}
        
        Job Description:
        ${jobDescription}
        
        1. Extract structured information from the resume (name, email, skills, experience, education)
        2. Compare the candidate's profile against the job requirements
        3. Calculate a match score (0-100) based on skills, experience, and qualifications
        4. Identify the candidate's strengths and gaps relative to the job requirements
        
        Format your response as a structured object with candidateData, matchScore, and matchDetails.
      `,
    })

    // In a real application, you would save this to your database
    return object
  } catch (error) {
    console.error("Error analyzing resume:", error)
    throw error
  }
}

// Mock function to get job description - in a real app, this would come from your database
function getMockJobDescription(jobId: string) {
  const jobDescriptions: Record<string, string> = {
    "1": `
      Senior Frontend Developer
      
      We are looking for a Senior Frontend Developer with 5+ years of experience in building modern web applications.
      
      Required Skills:
      - Strong proficiency in React, TypeScript, and modern JavaScript
      - Experience with state management (Redux, Context API)
      - Expertise in CSS, responsive design, and UI/UX principles
      - Knowledge of performance optimization and accessibility
      
      Responsibilities:
      - Develop and maintain frontend applications
      - Collaborate with designers and backend developers
      - Mentor junior developers
      - Participate in code reviews and architectural decisions
      
      Qualifications:
      - Bachelor's degree in Computer Science or related field
      - 5+ years of frontend development experience
      - Strong problem-solving skills
    `,
    "2": `
      Backend Engineer
      
      We are seeking a Backend Engineer with experience in building scalable APIs and services.
      
      Required Skills:
      - Proficiency in Node.js, Express, and RESTful API design
      - Experience with databases (MongoDB, PostgreSQL)
      - Knowledge of authentication, security, and performance optimization
      - Familiarity with cloud services (AWS, Azure, or GCP)
      
      Responsibilities:
      - Design and implement backend services and APIs
      - Optimize application performance and scalability
      - Collaborate with frontend developers and DevOps
      
      Qualifications:
      - Bachelor's degree in Computer Science or related field
      - 3+ years of backend development experience
    `,
    "3": `
      Product Manager
      
      We are looking for a Product Manager to lead our product development efforts.
      
      Required Skills:
      - Experience in product management and strategy
      - Strong analytical and problem-solving abilities
      - Excellent communication and stakeholder management
      - Familiarity with agile methodologies
      
      Responsibilities:
      - Define product vision, strategy, and roadmap
      - Gather and prioritize requirements
      - Work closely with engineering, design, and marketing teams
      
      Qualifications:
      - Bachelor's degree in Business, Computer Science, or related field
      - 4+ years of product management experience
      - Experience in the SaaS industry is a plus
    `,
  }

  return jobDescriptions[jobId] || "Job description not found"
}

