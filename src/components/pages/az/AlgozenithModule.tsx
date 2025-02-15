import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { getModuleOverview } from '@/services/az-service'
import { Skeleton } from '@/components/ui/skeleton'

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

function AlgozenithModule() {
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Module Problems</h1>
      <div className="space-y-4">
        {problems.map(problem => (
          <Link
            key={problem.id}
            to={`/az/chapters/${chapter}/modules/${module}/problems/${problem.fileName.split('.')[0]}`}
          >
            <div 
              className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold">{problem.title}</h3>
              <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                <span>Problem #{problem.id}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AlgozenithModule