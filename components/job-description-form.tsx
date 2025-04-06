"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, Briefcase, Sparkles } from "lucide-react"
import { analyzeJobDescription } from "@/lib/agents/job-description-agent"
import { Badge } from "@/components/ui/badge"

export function JobDescriptionForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedData, setAnalyzedData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    try {
      const result = await analyzeJobDescription(title, description)
      setAnalyzedData(result)
    } catch (error) {
      console.error("Error analyzing job description:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Job Title
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-10 h-10 bg-white dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Job Description
            </Label>
            <Textarea
              id="description"
              placeholder="Paste the full job description here..."
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none bg-white dark:bg-slate-800"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isAnalyzing}
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Job Description
            </>
          )}
        </Button>
      </form>

      {analyzedData && (
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800">
          <div className="bg-slate-100 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <h3 className="font-medium text-slate-800 dark:text-slate-200">Analysis Complete</h3>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analyzedData.skills.map((skill: string, i: number) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Experience Required</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-100 dark:border-slate-700">
                  {analyzedData.experience}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Qualifications</h4>
                <ul className="space-y-2">
                  {analyzedData.qualifications.map((qual: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{i + 1}</span>
                      </div>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Key Responsibilities</h4>
                <ul className="space-y-2">
                  {analyzedData.responsibilities.map((resp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{i + 1}</span>
                      </div>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <Button variant="outline" className="w-full sm:w-auto">
                Save Job Description
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

