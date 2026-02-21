import { createFileRoute } from '@tanstack/react-router'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { WriterForm } from './-components/writer-form'

export const Route = createFileRoute('/(home)/_layout/vault/writer/')({
  component: WriterPage,
})

function WriterPage() {
  return (
    <MotionContainer as="main" className="space-y-12">
      <MotionItem>
        <WriterForm />
      </MotionItem>
    </MotionContainer>
  )
}
