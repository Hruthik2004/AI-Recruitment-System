// This is a mock database implementation
// In a real application, you would use a proper database like SQLite, PostgreSQL, etc.

interface JobDescription {
  id: string
  title: string
  description: string
  analyzedData: any
  createdAt: string
}

interface Candidate {
  id: string
  name: string
  email: string
  resumeText: string
  analyzedData: any
  matchScores: Record<string, number>
  createdAt: string
}

interface Interview {
  id: string
  candidateId: string
  jobId: string
  date: string
  time: string
  type: string
  status: string
  emailContent: string
  createdAt: string
}

// In-memory storage
const db = {
  jobDescriptions: new Map<string, JobDescription>(),
  candidates: new Map<string, Candidate>(),
  interviews: new Map<string, Interview>(),
}

// Job Description methods
export const jobDescriptionDb = {
  create: (data: Omit<JobDescription, "id" | "createdAt">) => {
    const id = `job-${Date.now()}`
    const jobDescription = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }
    db.jobDescriptions.set(id, jobDescription)
    return jobDescription
  },

  getAll: () => {
    return Array.from(db.jobDescriptions.values())
  },

  getById: (id: string) => {
    return db.jobDescriptions.get(id)
  },

  update: (id: string, data: Partial<JobDescription>) => {
    const jobDescription = db.jobDescriptions.get(id)
    if (!jobDescription) return null

    const updated = { ...jobDescription, ...data }
    db.jobDescriptions.set(id, updated)
    return updated
  },

  delete: (id: string) => {
    return db.jobDescriptions.delete(id)
  },
}

// Candidate methods
export const candidateDb = {
  create: (data: Omit<Candidate, "id" | "createdAt">) => {
    const id = `candidate-${Date.now()}`
    const candidate = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }
    db.candidates.set(id, candidate)
    return candidate
  },

  getAll: () => {
    return Array.from(db.candidates.values())
  },

  getById: (id: string) => {
    return db.candidates.get(id)
  },

  update: (id: string, data: Partial<Candidate>) => {
    const candidate = db.candidates.get(id)
    if (!candidate) return null

    const updated = { ...candidate, ...data }
    db.candidates.set(id, updated)
    return updated
  },

  delete: (id: string) => {
    return db.candidates.delete(id)
  },
}

// Interview methods
export const interviewDb = {
  create: (data: Omit<Interview, "id" | "createdAt">) => {
    const id = `interview-${Date.now()}`
    const interview = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }
    db.interviews.set(id, interview)
    return interview
  },

  getAll: () => {
    return Array.from(db.interviews.values())
  },

  getById: (id: string) => {
    return db.interviews.get(id)
  },

  getByCandidateId: (candidateId: string) => {
    return Array.from(db.interviews.values()).filter((interview) => interview.candidateId === candidateId)
  },

  getByJobId: (jobId: string) => {
    return Array.from(db.interviews.values()).filter((interview) => interview.jobId === jobId)
  },

  update: (id: string, data: Partial<Interview>) => {
    const interview = db.interviews.get(id)
    if (!interview) return null

    const updated = { ...interview, ...data }
    db.interviews.set(id, updated)
    return updated
  },

  delete: (id: string) => {
    return db.interviews.delete(id)
  },
}

