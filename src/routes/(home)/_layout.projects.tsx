import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(home)/_layout/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <main className="flex flex-col">
      <div>Hello "/(home)/_layout/projects"!</div>
    </main>
  )
}
