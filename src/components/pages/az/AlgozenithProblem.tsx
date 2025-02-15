import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { parseProblemData } from '@/utils/parsing-utils';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Clock, Database, Code, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProblemDetails } from '@/services/az-service';

interface EditorialCode {
  code: string;
  language: string;
}

interface ProblemData {
  body: string;
  completeApproach: string;
  constraints: string;
  difficulty: number;
  editorialCode: EditorialCode[];
  healthCheck: {
    issues: string[];
    lastUpdated: string;
  };
  hints: {
    hint1: string;
    hint2: string;
    solutionApproach: string;
  };
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

export default function AlgozenithProblemPage() {
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

  const copyToClipboard = async (text: string, type: 'input' | 'output') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type === 'input' ? 'Input' : 'Output'} copied to clipboard`,
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

  const getDifficultyColor = (difficulty: number) => {
    switch(difficulty) {
      case 1: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/70 transition-colors';
      case 2: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800/70 transition-colors';
      case 3: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800/70 transition-colors';
      default: return 'bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800/70 transition-colors';
    }
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
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {problemData.title}
                  </h1>
                  <Badge className={`${getDifficultyColor(problemData.difficulty)} px-3 py-1 shadow-sm ring-1 ring-black/5 dark:ring-white/10 font-medium`}>
                    Level {problemData.difficulty}
                  </Badge>
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
              <div className="flex flex-wrap gap-2">
                {problemData.tags.map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="px-3 py-1 text-sm bg-gradient-to-r from-violet-100/80 to-indigo-100/80 hover:from-violet-200 hover:to-indigo-200 dark:from-violet-900/50 dark:to-indigo-900/50 dark:hover:from-violet-800/60 dark:hover:to-indigo-800/60 transition-all duration-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10 hover:scale-105 cursor-default"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Tabs defaultValue="problem" className="w-full">
            <TabsList className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
              <TabsTrigger value="problem" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Problem</TabsTrigger>
              <TabsTrigger value="submissions" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Submissions</TabsTrigger>
              <TabsTrigger value="editorial" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Editorial</TabsTrigger>
              <TabsTrigger value="discussions" className="w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-100 data-[state=active]:to-indigo-100 dark:data-[state=active]:from-violet-900 dark:data-[state=active]:to-indigo-900">Discussions</TabsTrigger>
            </TabsList>

            <TabsContent value="problem" className="space-y-6 mt-6">
              {/* Problem Details */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Problem Statement</h2>
                </CardHeader>
                <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {problemData.body}
                  </ReactMarkdown>
                </CardContent>
              </Card>

              {/* Input Format */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Input Format</h2>
                </CardHeader>
                <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {problemData.inputFormat}
                  </ReactMarkdown>
                </CardContent>
              </Card>

              {/* Output Format */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Output Format</h2>
                </CardHeader>
                <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {problemData.outputFormat}
                  </ReactMarkdown>
                </CardContent>
              </Card>

              {/* Constraints */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Constraints</h2>
                </CardHeader>
                <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {problemData.constraints}
                  </ReactMarkdown>
                </CardContent>
              </Card>

              {/* Sample Test Cases */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Sample Test Cases</h2>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {problemData.samples.map((sample: { input: string; output: string }, index: number) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="grid md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm text-zinc-500 dark:text-zinc-400">Input {index + 1}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(sample.input, 'input')}
                              className="h-8 px-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950 font-mono text-sm overflow-x-auto border border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
                            {sample.input}
                          </pre>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm text-zinc-500 dark:text-zinc-400">Output {index + 1}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(sample.output, 'output')}
                              className="h-8 px-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950 font-mono text-sm overflow-x-auto border border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
                            {sample.output}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              {problemData.note && (
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-indigo-500" />
                      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Note</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {problemData.note}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
