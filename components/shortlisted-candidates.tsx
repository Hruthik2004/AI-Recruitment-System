"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, UserCheck, CalendarPlus, Mail, MoreHorizontal, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ShortlistedCandidates() {
  const [selectedJob, setSelectedJob] = useState("all")
  const [threshold, setThreshold] = useState(80)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock job list - in a real app, this would come from your database
  const jobList = [
    { id: "1", title: "Senior Frontend Developer" },
    { id: "2", title: "Backend Engineer" },
    { id: "3", title: "Product Manager" },
  ]

  // Mock shortlisted candidates - in a real app, this would come from your database
  const shortlistedCandidates = [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      matchScore: 92,
      skills: ["React", "TypeScript", "CSS", "UI/UX"],
      status: "New",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@example.com",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      matchScore: 85,
      skills: ["React", "JavaScript", "HTML", "CSS"],
      status: "Contacted",
    },
    {
      id: "3",
      name: "Emily Johnson",
      email: "emily.j@example.com",
      jobId: "2",
      jobTitle: "Backend Engineer",
      matchScore: 88,
      skills: ["Node.js", "Express", "MongoDB", "API Design"],
      status: "New",
    },
    {
      id: "4",
      name: "Michael Chen",
      email: "michael.c@example.com",
      jobId: "3",
      jobTitle: "Product Manager",
      matchScore: 81,
      skills: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
      status: "Interview Scheduled",
    },
  ]

  // Filter candidates based on selected job, threshold, and search query
  const filteredCandidates = shortlistedCandidates.filter((candidate) => {
    const matchesJob = selectedJob === "all" || candidate.jobId === selectedJob
    const matchesThreshold = candidate.matchScore >= threshold
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesJob && matchesThreshold && matchesSearch
  })

  // Function to get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "New":
        return "default"
      case "Contacted":
        return "secondary"
      case "Interview Scheduled":
        return "success"
      default:
        return "outline"
    }
  }

  // Function to get color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500"
    if (score >= 80) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search candidates..."
              className="pl-10 h-10 bg-white dark:bg-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="h-10 bg-white dark:bg-slate-800">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobList.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Label htmlFor="threshold-slider" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Match Score Threshold: {threshold}%
          </Label>
        </div>
        <Slider
          id="threshold-slider"
          min={50}
          max={100}
          step={5}
          value={[threshold]}
          onValueChange={(value) => setThreshold(value[0])}
          className="py-2"
        />
      </Card>

      <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-700/50">
            <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Job Position</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">{candidate.name}</div>
                      <div className="text-sm text-slate-500">{candidate.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{candidate.jobTitle}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getScoreColor(candidate.matchScore)}`}>
                      {candidate.matchScore}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 2).map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 2 && (
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none text-xs"
                        >
                          +{candidate.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <CalendarPlus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <UserCheck className="h-10 w-10 mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400">No candidates match your current filters</p>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your search or threshold</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <span>Showing</span>
          <strong className="text-slate-700 dark:text-slate-300">{filteredCandidates.length}</strong>
          <span>of</span>
          <strong className="text-slate-700 dark:text-slate-300">{shortlistedCandidates.length}</strong>
          <span>candidates</span>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <span>Export</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

