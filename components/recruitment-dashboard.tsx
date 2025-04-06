"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobDescriptionForm } from "@/components/job-description-form"
import { CandidateUpload } from "@/components/candidate-upload"
import { ShortlistedCandidates } from "@/components/shortlisted-candidates"
import { InterviewScheduler } from "@/components/interview-scheduler"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, CheckCircle2, CalendarClock, ArrowRight } from "lucide-react"

export function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState("job-descriptions")

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="job-descriptions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 mb-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <TabsTrigger
            value="job-descriptions"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden md:inline">Job Descriptions</span>
            <span className="md:hidden">Jobs</span>
          </TabsTrigger>
          <TabsTrigger
            value="candidates"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all"
          >
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Candidates</span>
            <span className="md:hidden">CVs</span>
          </TabsTrigger>
          <TabsTrigger
            value="shortlisted"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden md:inline">Shortlisted</span>
            <span className="md:hidden">Shortlist</span>
          </TabsTrigger>
          <TabsTrigger
            value="interviews"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all"
          >
            <CalendarClock className="h-4 w-4" />
            <span className="hidden md:inline">Interviews</span>
            <span className="md:hidden">Schedule</span>
          </TabsTrigger>
        </TabsList>

        <Card className="border-none shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <TabsContent value="job-descriptions" className="mt-0">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <Briefcase className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Job Descriptions</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Add and analyze job requirements</p>
                </div>
              </div>
              <JobDescriptionForm />
            </TabsContent>

            <TabsContent value="candidates" className="mt-0">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Candidate Management</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Upload and analyze candidate resumes</p>
                </div>
              </div>
              <CandidateUpload />
            </TabsContent>

            <TabsContent value="shortlisted" className="mt-0">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Shortlisted Candidates</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Review candidates who meet your criteria</p>
                </div>
              </div>
              <ShortlistedCandidates />
            </TabsContent>

            <TabsContent value="interviews" className="mt-0">
              <div className="flex items-center mb-6">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <CalendarClock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Interview Scheduling</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Schedule and manage candidate interviews</p>
                </div>
              </div>
              <InterviewScheduler />
            </TabsContent>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <span>Powered by AI SDK</span>
            <ArrowRight className="h-3 w-3 mx-2" />
            <span>Multi-Agent Recruitment System</span>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

