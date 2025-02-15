import { useEffect, useState } from 'react'
import { getChapterOverview, getChaptersList } from '@/services/az-service'
import { Skeleton } from '@/components/ui/skeleton'
import { parseChaptersData, parseModulesData } from '@/utils/parsing-utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from 'react-router'

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
    return <Skeleton className="h-24 w-full mt-4" />
  }
  const formatModuleName = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-zinc-900/50 dark:to-zinc-900/30 p-6 shadow-lg backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{module.name}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{module.description}</p>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {module.resourcesCount} resources
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {module.timeInMinutes} min
              </span>
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
}

export default function AlgozenithChapters() {
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
      <div className="container mx-auto p-6 space-y-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
      >
        Algozenith Learning Path
      </motion.h1>

      <Tabs defaultValue={chapters[0]?.id.toString()} className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TabsList className="w-full h-12 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl mb-8 p-1 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50">
            {chapters.map((chapter) => (
              <TabsTrigger
                key={chapter.id}
                value={chapter.id.toString()}
                className="flex-1 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:to-indigo-500/10 rounded-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{chapter.name}</span>
                  <span className="text-xs text-zinc-500">
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
    </motion.div>
  )
}
