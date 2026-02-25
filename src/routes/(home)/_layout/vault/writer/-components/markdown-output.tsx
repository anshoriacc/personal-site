import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Copy01Icon,
  Download01Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

type MarkdownOutputProps = {
  markdown: string
  filename: string
}

function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function MarkdownOutput({ markdown, filename }: MarkdownOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [markdown])

  const handleDownload = useCallback(() => {
    downloadMarkdownFile(filename, markdown)
  }, [filename, markdown])

  return (
    <motion.div
      data-slot="markdown-output"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Generated Markdown
          </CardTitle>
          <CardAction>
            <div className="flex gap-2">
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="relative"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div key="copied" exit={{ height: 0 }}>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1.5"
                        >
                          <HugeiconsIcon icon={Tick01Icon} />
                          Copied!
                        </motion.span>
                      </motion.div>
                    ) : (
                      <motion.div key="copy" exit={{ height: 0 }}>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1.5"
                        >
                          <HugeiconsIcon icon={Copy01Icon} />
                          Copy
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <HugeiconsIcon icon={Download01Icon} />
                  Download .md
                </Button>
              </motion.div>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Textarea
              readOnly
              value={markdown}
              className="min-h-100 resize-none font-mono text-sm"
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { MarkdownOutput, type MarkdownOutputProps }
