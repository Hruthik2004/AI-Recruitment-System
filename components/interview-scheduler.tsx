"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  CalendarIcon,
  Clock,
  Mail,
  Video,
  MapPin,
  Loader2,
  Phone,
  CalendarIcon as CalendarFull,
  CheckCircle2,
} from "lucide-react"
import { scheduleInterview } from "@/lib/agents/interview-scheduler-agent"

export function InterviewScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [interviewType, setInterviewType] = useState("video")
  const [customMessage, setCustomMessage] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduledInterviews, setScheduledInterviews] = useState<any[]>([])
  const [emailPreview, setEmailPreview] = useState<string | null>(null)

  // Mock candidate list - in a real app, this would come from your database
  const shortlistedCandidates = [
    { id: "1", name: "Jane Smith", email: "jane.smith@example.com", jobTitle: "Senior Frontend Developer" },
    { id: "2", name: "John Doe", email: "john.doe@example.com", jobTitle: "Senior Frontend Developer" },
    { id: "3", name: "Emily Johnson", email: "emily.j@example.com", jobTitle: "Backend Engineer" },
    { id: "4", name: "Michael Chen", email: "michael.c@example.com", jobTitle: "Product Manager" },
  ]

  // Mock time slots - in a real app, this would be dynamically generated based on availability
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  const handleScheduleInterview = async () => {
    if (!selectedCandidate || !selectedDate || !selectedTime) return

    setIsScheduling(true)

    try {
      const candidate = shortlistedCandidates.find((c) => c.id === selectedCandidate)
      if (!candidate) return

      const interviewDate = format(selectedDate, "yyyy-MM-dd")

      // In a real app, this would call your API to schedule the interview
      const result = await scheduleInterview({
        candidateId: selectedCandidate,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        jobTitle: candidate.jobTitle,
        interviewDate,
        interviewTime: selectedTime,
        interviewType,
        customMessage,
      })

      // Add the scheduled interview to the list
      setScheduledInterviews([
        ...scheduledInterviews,
        {
          id: Date.now().toString(),
          candidateName: candidate.name,
          jobTitle: candidate.jobTitle,
          date: interviewDate,
          time: selectedTime,
          type: interviewType,
        },
      ])

      // Set email preview
      setEmailPreview(result.emailContent)

      // Reset form
      setSelectedCandidate("")
      setCustomMessage("")
    } catch (error) {
      console.error("Error scheduling interview:", error)
    } finally {
      setIsScheduling(false)
    }
  }

  // Function to get icon based on interview type
  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "inperson":
        return <MapPin className="h-4 w-4" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <TabsTrigger
            value="schedule"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Schedule Interview</span>
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all"
          >
            <CalendarFull className="h-4 w-4" />
            <span>Upcoming Interviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Interview Details</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Candidate</label>
                    <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue placeholder="Choose a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {shortlistedCandidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            <div className="flex flex-col">
                              <span>{candidate.name}</span>
                              <span className="text-slate-500 text-xs">{candidate.jobTitle}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interview Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={interviewType === "video" ? "default" : "outline"}
                        className={`flex items-center justify-center gap-2 ${
                          interviewType === "video"
                            ? "bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() => setInterviewType("video")}
                      >
                        <Video className="h-4 w-4" />
                        <span>Video</span>
                      </Button>
                      <Button
                        type="button"
                        variant={interviewType === "phone" ? "default" : "outline"}
                        className={`flex items-center justify-center gap-2 ${
                          interviewType === "phone"
                            ? "bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() => setInterviewType("phone")}
                      >
                        <Phone className="h-4 w-4" />
                        <span>Phone</span>
                      </Button>
                      <Button
                        type="button"
                        variant={interviewType === "inperson" ? "default" : "outline"}
                        className={`flex items-center justify-center gap-2 ${
                          interviewType === "inperson"
                            ? "bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() => setInterviewType("inperson")}
                      >
                        <MapPin className="h-4 w-4" />
                        <span>In-Person</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="rounded-md border-slate-200 dark:border-slate-700"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Time</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-slate-500" />
                              <span>{time}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Custom Message (Optional)
                    </label>
                    <Textarea
                      placeholder="Add any additional information for the candidate..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={4}
                      className="resize-none bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Preview & Confirm</h3>

                {selectedCandidate && selectedDate && selectedTime ? (
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-md p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          {getInterviewTypeIcon(interviewType)}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-slate-200">
                            {interviewType === "video"
                              ? "Video Interview"
                              : interviewType === "phone"
                                ? "Phone Interview"
                                : "In-Person Interview"}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {shortlistedCandidates.find((c) => c.id === selectedCandidate)?.name ||
                              "Selected Candidate"}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
                              <span>{format(selectedDate, "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-500" />
                              <span>{selectedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {emailPreview ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-md">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Interview scheduled successfully!</span>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4 bg-white dark:bg-slate-800/50">
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Email Preview</h4>
                          <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                            {emailPreview}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={handleScheduleInterview}
                        disabled={!selectedCandidate || !selectedDate || !selectedTime || isScheduling}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                      >
                        {isScheduling ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Schedule & Send Invitation
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                      <CalendarIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                      Schedule an Interview
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                      Select a candidate, date, and time to schedule an interview and send an automated invitation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              {scheduledInterviews.length > 0 ? (
                <div className="space-y-4">
                  {scheduledInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          {getInterviewTypeIcon(interview.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800 dark:text-slate-200">{interview.candidateName}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{interview.jobTitle}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
                              <span>{interview.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-500" />
                              <span>{interview.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border-none"
                        >
                          {interview.type === "video"
                            ? "Video Call"
                            : interview.type === "phone"
                              ? "Phone Interview"
                              : "In-Person"}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <CalendarFull className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                    <CalendarFull className="h-8 w-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                    No Interviews Scheduled
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                    You haven't scheduled any interviews yet. Go to the "Schedule Interview" tab to get started.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-slate-200 dark:border-slate-700"
                    onClick={() => document.querySelector('[data-state="inactive"][value="schedule"]')?.click()}
                  >
                    Schedule Your First Interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

