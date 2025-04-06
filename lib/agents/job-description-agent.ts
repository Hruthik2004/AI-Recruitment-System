import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for the job description analysis
const jobDescriptionSchema = z.object({
  skills: z.array(z.string()),
  experience: z.string(),
  qualifications: z.array(z.string()),
  responsibilities: z.array(z.string()),
})

export async function analyzeJobDescription(title: string, description: string) {
  try {
    // Use the AI SDK to analyze the job description
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: jobDescriptionSchema,
      prompt: `
        You are a Job Description Summarizer agent. Your task is to analyze the following job description
        for the position of "${title}" and extract key information.
        
        Job Description:
        ${description}
        
        Extract and summarize the following information:
        1. Required skills (technical and soft skills)
        2. Years of experience required
        3. Educational qualifications and certifications
        4. Key job responsibilities
        
        Format your response as a structured object with these categories.
      `,
    })

    // In a real application, you would save this to your database
    return object
  } catch (error) {
    console.error("Error analyzing job description:", error)
    throw error
  }
}

