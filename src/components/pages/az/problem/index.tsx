import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { parseProblemData } from '@/utils/parsing-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, Code, Star, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProblemDetails } from '@/services/az-service';
import ProblemTab from './tabs/ProblemTab';
import HintsTab from './tabs/HintsTab';
import EditorialTab from './tabs/EditorialTab';

interface EditorialCode {
  code: string;
  language: string;
}

interface ProblemData {
  body: string;
  completeApproach: string;
  constraints: string;
  difficulty: number | null;
  editorialCode: EditorialCode[];
  healthCheck: {
    issues: string[];
    lastUpdated: string;
  };
  hints: Record<string, string>;
  id: number;
  inputFormat: string;
  languages: string[];
  memoryLimitMb: number;
  note: string;
  outputFormat: string;
  samples: {
    input: string;
    output: string;
  }[];
  status: string;
  tags: string[];
  templateCode: any[];
  timeLimitSec: number;
  title: string;
  videoEditorialId: string | null;
}

export default function Problem() {
  const [problemData, setProblemData] = useState<ProblemData | null>(null);

  const { chapter, module, problem } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!chapter || !module || !problem) return;
    const fetchProblemData = async () => {
      const response = await getProblemDetails(chapter, module, problem);
      setProblemData(parseProblemData(response.data));
    };
    fetchProblemData();
  }, [chapter, module, problem]);

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: message,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const getDifficultyStars = (difficulty: number | null) => {
    if (difficulty === null) return null;
    
    return (
      <div className="flex gap-0.5">
        {[...Array(difficulty)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
        ))}
        {[...Array(5 - difficulty)].map((_, i) => (
          <Star key={i + difficulty} className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
        ))}
      </div>
    );
  };

  const renderTags = (tags: string[]) => {
    const companyTags = tags.filter(tag => tag.startsWith('company-'));
    const otherTags = tags.filter(tag => !tag.startsWith('company-'));

    return (
      <div className="flex flex-row flex-wrap gap-4">
        {companyTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {companyTags.map((tag: string) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50 dark:hover:from-blue-900/60 dark:hover:to-cyan-900/60 transition-all duration-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10 hover:scale-105 cursor-default flex items-center gap-1"
              >
                <Building2 className="h-2.5 w-2.5" />
                {tag.replace('company-', '')}
              </Badge>
            ))}
          </div>
        )}
        {otherTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {otherTags.map((tag: string) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-2 py-0.5 text-xs bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 dark:from-rose-950/50 dark:to-pink-950/50 dark:hover:from-rose-900/60 dark:hover:to-pink-900/60 transition-all duration-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10 hover:scale-105 cursor-default"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!problemData) return null;

  return (
    <ScrollArea className="h-screen bg-gradient-to-br from-violet-50 via-zinc-50 to-indigo-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-indigo-950">
      <div className="container mx-auto p-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Problem Header */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="flex flex-col gap-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {problemData.title}
                </h1>
                <div className="flex items-center gap-4">
                  {getDifficultyStars(problemData.difficulty)}
                  {renderTags(problemData.tags)}
                </div>
                <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1 bg-white/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full hover:bg-white/70 dark:hover:bg-zinc-800/70 transition-colors">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    {problemData.timeLimitSec}s
                  </div>
                  <div className="flex items-center gap-1 bg-white/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full hover:bg-white/70 dark:hover:bg-zinc-800/70 transition-colors">
                    <Database className="h-4 w-4 text-violet-500" />
                    {problemData.memoryLimitMb}MB
                  </div>
                  <div className="flex items-center gap-1 bg-white/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full hover:bg-white/70 dark:hover:bg-zinc-800/70 transition-colors">
                    <Code className="h-4 w-4 text-blue-500" />
                    Problem #{problemData.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="problem" className="w-full">
            <TabsList className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
              <TabsTrigger value="problem" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Problem</TabsTrigger>
              <TabsTrigger value="hints" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Hints</TabsTrigger>
              {/* <TabsTrigger value="submissions" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Submissions</TabsTrigger> */}
              <TabsTrigger value="editorial" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Editorial</TabsTrigger>
            </TabsList>

            <TabsContent value="problem">
              <ProblemTab 
                problemData={{
                  body: problemData.body,
                  inputFormat: problemData.inputFormat,
                  outputFormat: problemData.outputFormat,
                  constraints: problemData.constraints,
                  note: problemData.note,
                  samples: problemData.samples
                }}
                copyToClipboard={copyToClipboard}
              />
            </TabsContent>
            <TabsContent value="hints">
              <HintsTab hints={problemData.hints} />
            </TabsContent>
            <TabsContent value="editorial">
              <EditorialTab editorialCode={problemData.editorialCode} copyToClipboard={copyToClipboard} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
