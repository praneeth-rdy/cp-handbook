import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EDITORIAL_LANGUAGES_MAP } from '@/static/constants';

interface EditorialCode {
  code: string;
  language: string;
}

interface EditorialTabProps {
  editorialCode: EditorialCode[];
  copyToClipboard: (text: string, message: string) => void;
}

export default function EditorialTab({ editorialCode, copyToClipboard }: EditorialTabProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    const cleanCode = code.replace(/^```\w*\n|```$/g, '');
    copyToClipboard(cleanCode, 'Code copied to clipboard');
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!editorialCode || editorialCode.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50"
      >
        <Alert variant="destructive" className="bg-white/50 dark:bg-zinc-900/50 border-red-200/50 dark:border-red-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Editorial Available</AlertTitle>
          <AlertDescription>
            The editorial solution for this problem is not available yet.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
          Editorial Solution
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Review the solution and understand the approach.
        </p>
      </div>

      <div className="space-y-4">
        {editorialCode.map((solution, index) => (
          <Card key={index} className="overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-b border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Solution in {solution.language}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(solution.code, index)}
                  className="h-8 px-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <SyntaxHighlighter
                language={EDITORIAL_LANGUAGES_MAP.get(solution.language) || solution.language.toLowerCase()}
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  borderRadius: 6,
                  padding: '1.5rem',
                }}
              >
                {solution.code.replace(/^```\w*\n|```$/g, '')}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
