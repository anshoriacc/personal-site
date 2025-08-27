import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const AutomationCard = () => {
  return (
    <div className="space-y-2">
      <Card className="relative isolate aspect-[4/3] w-full overflow-hidden">
        <div className="min-h-full overflow-y-scroll px-6 flex flex-col gap-4">
          {[...Array(5)].map((_, index) => (
            <Card
              key={index}
              className="bg-background flex w-full flex-col rounded-md border-l-4 border-l-[#4B86E3] p-4 py-4">
              <div className="grid grid-cols-[2rem_1fr] items-center gap-4">
                <ChevronDownIcon />
                <div className="flex items-center justify-between gap-4"></div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <p className="text-center text-xs text-neutral-500">
        Example of improved automations card.
      </p>
    </div>
  );
};
