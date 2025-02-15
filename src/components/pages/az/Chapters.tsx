import { useEffect, useState } from 'react'
import { getChapterOverview, getChaptersList } from '@/services/az-service'
import { Skeleton } from '@/components/ui/skeleton'
import { parseChaptersData, parseModulesData } from '@/utils/parsing-utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from 'react-router'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'

interface Chapter {
  id: number
  name: string
  description: string | null
  timeInMinutes: number
  code: string
}

interface Module {
  id: number
  name: string
  description: string
  resourcesCount: number
  timeInMinutes: number
  type: string
}

const ModulesList = ({ chapter }: { chapter: Chapter }) => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadModules = async () => {
      setLoading(true)
      try {
        const response = await getChapterOverview(chapter.code)
        setModules(parseModulesData(response.data))
      } catch (error) {
        console.error('Error fetching modules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [chapter.code])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const formatModuleName = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {modules.map((module, index) => (
        <Link 
          to={`/az/chapters/${chapter.code}/modules/${formatModuleName(module.name)}`}
          key={module.id}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-zinc-900/80 dark:to-zinc-900/40 p-6 shadow-lg backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {module.name}
              </h3>
              
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 flex-grow">
                {module.description}
              </p>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <BookOpen className="w-4 h-4 text-violet-500" />
                    {module.resourcesCount}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    {module.timeInMinutes}m
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-violet-500 transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
}

export default function Chapters() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await getChaptersList()
        const parsedData = parseChaptersData(response.data)
        setChapters(parsedData)
      } catch (error) {
        console.error('Error fetching chapters:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-6">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-violet-50 via-zinc-50 to-indigo-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-indigo-950"
    >
      <div className="container mx-auto px-8 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent"
        >
          AZ Problem Sets
        </motion.h1>

        <Tabs defaultValue={chapters[0]?.id.toString()} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-4 z-50"
          >
            <TabsList className="w-full h-14 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl mb-8 p-1.5 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50">
              {chapters.map((chapter) => (
                <TabsTrigger
                  key={chapter.id}
                  value={chapter.id.toString()}
                  className="flex-1 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:via-indigo-500/10 data-[state=active]:to-blue-500/10 rounded-lg transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{chapter.name}</span>
                    <span className="text-xs text-zinc-500 mt-0.5">
                      {Math.floor(chapter.timeInMinutes / 60)}h {chapter.timeInMinutes % 60}m
                    </span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            {chapters.map((chapter) => (
              <TabsContent key={chapter.id} value={chapter.id.toString()}>
                <ModulesList chapter={chapter} />
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </motion.div>
  )
}
