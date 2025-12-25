import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end px-4 pt-4">
        <ThemeToggle />
      </div>
      <ComponentExample />
    </div>
  );
}