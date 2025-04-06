import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for the shortlisting decision
const shortlistingSchema = z.object({
  decision: z.enum(["shortlist", "reject"]),
  confidence: z.number().min(0).max(100),
  reasoning: z.string(),
  suggestedNextSteps: z.array(z.string()),
})

export async function evaluateForShortlisting(candidateId: string, matchScore: number, threshold = 80) {
  try {
    // In a real application, you would fetch the candidate and job data from your database
    // For this example, we'll use mock data
    const candidateData = getMockCandidateData(candidateId)

    // If match score is below threshold, we can make a quick decision
    if (matchScore < threshold) {
      return {
        decision: "reject",
        confidence: 95,
        reasoning: `Match score (${matchScore}) is below the threshold (${threshold})`,
        suggestedNextSteps: ["Send rejection email", "Keep candidate in database for future opportunities"],
      }
    }

    // For candidates above the threshold, use the AI to make a more nuanced decision
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: shortlistingSchema,
      prompt: `
        You are a Shortlisting Agent. Your task is to evaluate whether a candidate should be shortlisted
        for an interview based on their profile and match score.
        
        Candidate Information:
        ${JSON.stringify(candidateData, null, 2)}
        
        Match Score: ${matchScore} (out of 100)
        Threshold: ${threshold}
        
        Make a decision on whether to shortlist this candidate. Consider:
        1. The match score relative to the threshold
        2. The candidate's specific skills and experience
        3. Any standout qualifications or red flags
        
        Provide your decision, confidence level, reasoning, and suggested next steps.
      `,
    })

    // In a real application, you would save this to your database
    return object
  } catch (error) {
    console.error("Error evaluating for shortlisting:", error)
    throw error
  }
}

// Mock function to get candidate data - in a real app, this would come from your database
function getMockCandidateData(candidateId: string) {
  const candidateData: Record<string, any> = {
    "1": {
      name: "Jane Smith",
      jobTitle: "Senior Frontend Developer",
      skills: ["React", "TypeScript", "CSS", "UI/UX", "Redux", "Jest"],
      experience: [
        { title: "Frontend Developer", company: "Tech Co", period: "2018-2022" },
        { title: "UI Developer", company: "Web Solutions", period: "2016-2018" },
      ],
      education: [{ degree: "B.S. Computer Science", institution: "University of Technology", year: "2016" }],
    },
    "2": {
      name: "John Doe",
      jobTitle: "Senior Frontend Developer",
      skills: ["React", "JavaScript", "HTML", "CSS", "Angular"],
      experience: [
        { title: "Frontend Developer", company: "Digital Agency", period: "2019-2022" },
        { title: "Web Developer", company: "Startup Inc", period: "2017-2019" },
      ],
      education: [{ degree: "B.A. Design", institution: "Art University", year: "2017" }],
    },
  }

  return candidateData[candidateId] || { name: "Unknown Candidate" }
}

