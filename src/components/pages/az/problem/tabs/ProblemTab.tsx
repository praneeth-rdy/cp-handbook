import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface ProblemTabProps {
  problemData: {
    body: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    note: string;
    samples: {
      input: string;
      output: string;
    }[];
  };
  copyToClipboard: (text: string, message: string) => void;
}

export default function ProblemTab({ problemData, copyToClipboard }: ProblemTabProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50"
    >
      {/* Problem Details */}
      <Card className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
        <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
            Problem Statement
          </h2>
        </CardHeader>
        <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
            {problemData.body}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Input Format */}
      <Card className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
        <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
            Input Format
          </h2>
        </CardHeader>
        <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
            {problemData.inputFormat}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Output Format */}
      <Card className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
        <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
            Output Format
          </h2>
        </CardHeader>
        <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
            {problemData.outputFormat}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Constraints */}
      {problemData.constraints && (
        <Card className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
              Constraints
            </h2>
          </CardHeader>
          <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
              {problemData.constraints}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}

      {/* Sample Test Cases */}
      <Card className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
        <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
            Sample Test Cases
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {problemData.samples.map((sample, index) => (
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
                      onClick={() => copyToClipboard(sample.input, 'Input copied to clipboard')}
                      className="h-8 px-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="p-4 rounded-lg bg-[#282c34] text-white font-mono text-sm overflow-x-auto border border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
                    {sample.input}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-zinc-500 dark:text-zinc-400">Output {index + 1}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sample.output, 'Output copied to clipboard')}
                      className="h-8 px-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="p-4 rounded-lg bg-[#282c34] text-white font-mono text-sm overflow-x-auto border border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
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
        <Card className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                Note
              </h2>
            </div>
          </CardHeader>
          <CardContent className="prose prose-zinc dark:prose-invert max-w-none pt-6">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
              {problemData.note}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
