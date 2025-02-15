import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { getModuleOverview } from '@/services/az-service'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'

interface Problem {
  id: number
  title: string
  fileName: string
}

const parseProblemsData = (data: any[]): Problem[] => {
  return data.map(item => ({
    id: parseInt(item.file_name.split('.')[0]),
    title: item.title,
    fileName: item.file_name
  }))
}

export default function Module() {
  const { chapter, module } = useParams()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModuleOverview = async () => {
      try {
        if (!chapter || !module) return
        const response = await getModuleOverview(chapter, module)
        const parsedData = parseProblemsData(response)
        setProblems(parsedData)
      } catch (error) {
        console.error('Error fetching module overview:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModuleOverview()
  }, [chapter, module])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-violet-50 via-zinc-50 to-indigo-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-indigo-950"
    >
      <div className="container mx-auto p-8 max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Module Problems
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {problems.map((problem, index) => (
            <Link
              key={problem.id}
              to={`/az/chapters/${chapter}/modules/${module}/problems/${problem.fileName.split('.')[0]}`}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-6 shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="w-4 h-4 text-violet-500" />
                        Problem #{problem.id}
                      </span>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-zinc-400 group-hover:text-violet-500 transform group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}