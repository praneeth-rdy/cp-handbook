import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LightbulbIcon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface HintsTabProps {
  hints: Record<string, string>;
}

export default function HintsTab({ hints }: HintsTabProps) {
  const [openHints, setOpenHints] = useState<{ [key: string]: boolean }>({})

  const toggleHint = (hintKey: string) => {
    setOpenHints(prev => ({
      ...prev,
      [hintKey]: !prev[hintKey]
    }))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
          Hints & Solution Approach
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Stuck? Reveal hints progressively to guide you toward the solution.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(hints).map(([key, content], index) => (
          <Card 
            key={key}
            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
              openHints[key] 
                ? 'bg-white/70 dark:bg-zinc-900/70' 
                : 'bg-white/50 dark:bg-zinc-900/50'
            } border-zinc-200/50 dark:border-zinc-800/50`}
          >
            <Button
              variant="ghost"
              onClick={() => toggleHint(key)}
              className={`w-full p-4 h-auto flex items-center justify-between text-left ${
                openHints[key] && 'border-b border-zinc-200/50 dark:border-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {key === 'solutionApproach' ? (
                  <Sparkles className="h-5 w-5 text-violet-500" />
                ) : (
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium">
                  {key === 'solutionApproach' ? 'Solution Approach' : `Progressive Hint ${index + 1}`}
                </span>
              </div>
              <ChevronDown 
                className={`h-5 w-5 transition-transform duration-200 ${openHints[key] ? 'rotate-180' : ''}`}
              />
            </Button>
            
            <AnimatePresence>
              {openHints[key] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6 prose prose-zinc dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeRaw, rehypeKatex]}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
