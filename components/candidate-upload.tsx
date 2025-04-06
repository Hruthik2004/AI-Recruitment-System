"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, FileText, BarChart2, Upload, Briefcase, GraduationCap, Building2, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { analyzeResume } from "@/lib/agents/recruiting-agent"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function CandidateUpload() {
  const [selectedJob, setSelectedJob] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchScore, setMatchScore] = useState<number | null>(null)
  const [candidateData, setCandidateData] = useState<any>(null)
  const [progress, setProgress] = useState(0)

  // Mock job list - in a real app, this would come from your database
  const jobList = [
    { id: "1", title: "Senior Frontend Developer" },
    { id: "2", title: "Backend Engineer" },
    { id: "3", title: "Product Manager" },
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedJob) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      // In a real app, you would upload the file to your server
      // Here we're simulating the resume analysis
      const fileContent = await readFileAsText(file)
      const result = await analyzeResume(fileContent, selectedJob)

      setCandidateData(result.candidateData)
      setMatchScore(result.matchScore)
      setProgress(100)
    } catch (error) {
      console.error("Error analyzing resume:", error)
    } finally {
      clearInterval(interval)
      setIsAnalyzing(false)
    }
  }

  // Helper function to read file content
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // Function to get color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500"
    if (score >= 80) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    if (score >= 60) return "text-orange-500"
    return "text-red-500"
  }

  // Function to get background color based on match score
  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 dark:bg-emerald-900/30"
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30"
    if (score >= 70) return "bg-amber-100 dark:bg-amber-900/30"
    if (score >= 60) return "bg-orange-100 dark:bg-orange-900/30"
    return "bg-red-100 dark:bg-red-900/30"
  }

  return (
    <div className="space-y-8">
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-select" className="text-sm font-medium">
                  Select Job Position
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger id="job-select" className="pl-10 h-10 bg-white dark:bg-slate-800">
                      <SelectValue placeholder="Select a job position" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobList.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume-upload" className="text-sm font-medium">
                  Upload Resume/CV
                </Label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50 dark:bg-slate-800/50">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={!selectedJob || isAnalyzing}
                    className="hidden"
                  />
                  <Label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {isAnalyzing ? "Analyzing..." : "Drag & drop or click to upload"}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT</span>
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              {isAnalyzing ? (
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-600 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Analyzing resume...
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-slate-200 dark:bg-slate-700" />
                  <div className="pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Our AI is analyzing the resume, extracting skills, experience, and calculating match score
                    </p>
                  </div>
                </div>
              ) : candidateData && matchScore !== null ? (
                <div className="w-full text-center">
                  <div
                    className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${getScoreBgColor(matchScore)} mb-3`}
                  >
                    <span className={`text-3xl font-bold ${getScoreColor(matchScore)}`}>{matchScore}%</span>
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Match Score</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {matchScore >= 80
                      ? "Excellent match!"
                      : matchScore >= 70
                        ? "Good match"
                        : matchScore >= 60
                          ? "Average match"
                          : "Below average match"}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Select a job and upload a resume to see the match score
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {candidateData && matchScore !== null && (
        <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-800">
          <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{candidateData.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">{candidateData.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart2 className={`h-5 w-5 ${getScoreColor(matchScore)}`} />
                <span className={`text-lg font-bold ${getScoreColor(matchScore)}`}>{matchScore}% Match</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">S</span>
                  </div>
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {candidateData.skills.map((skill: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-2">
                    <GraduationCap className="h-3 w-3 text-slate-600 dark:text-slate-300" />
                  </div>
                  Education
                </h4>
                <ul className="space-y-4 mb-6">
                  {candidateData.education.map((edu: any, i: number) => (
                    <li key={i} className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{edu.degree}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {edu.institution}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {edu.year}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-2">
                    <Building2 className="h-3 w-3 text-slate-600 dark:text-slate-300" />
                  </div>
                  Experience
                </h4>
                <ul className="space-y-4 mb-6">
                  {candidateData.experience.map((exp: any, i: number) => (
                    <li key={i} className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{exp.title}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{exp.company}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {exp.period}
                      </div>
                    </li>
                  ))}
                </ul>

                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">A</span>
                  </div>
                  Strengths & Gaps
                </h4>
                <div className="space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-md p-4 border border-emerald-100 dark:border-emerald-900/30">
                    <h5 className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-2">Strengths:</h5>
                    <ul className="space-y-1">
                      {candidateData.strengths.map((str: string, i: number) => (
                        <li key={i} className="text-sm text-emerald-600 dark:text-emerald-300 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-4 border border-amber-100 dark:border-amber-900/30">
                    <h5 className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">Gaps:</h5>
                    <ul className="space-y-1">
                      {candidateData.gaps.map((gap: string, i: number) => (
                        <li key={i} className="text-sm text-amber-600 dark:text-amber-300 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                Download Analysis
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600">
                <FileText className="mr-2 h-4 w-4" />
                Save Candidate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

