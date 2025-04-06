import { RecruitmentDashboard } from "@/components/recruitment-dashboard"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="recruitment-theme">
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              AI Recruitment System
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-center max-w-2xl">
              Streamline your hiring process with our intelligent multi-agent recruitment system
            </p>
          </div>
          <RecruitmentDashboard />
        </div>
      </main>
    </ThemeProvider>
  )
}

