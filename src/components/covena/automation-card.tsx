import { ChevronDownIcon } from "lucide-react";
import { Card } from "../ui/card";

export const AutomationCard = () => {
  return (
    <div className="space-y-2">
      <Card className="relative isolate aspect-[4/3] w-full overflow-hidden">
        <div className="flex min-h-full flex-col gap-4 overflow-y-scroll px-6">
          <Card className="bg-background flex w-full flex-col rounded-md border-l-4 border-l-[#4B86E3] p-4 py-4">
            <div className="grid grid-cols-[2rem_1fr] items-center gap-4">
              <ChevronDownIcon />
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">New Automation</h3>
                    <span className="flex h-5 items-center rounded-full bg-green-500/10 px-2 text-xs font-medium text-green-500">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Trigger: Customer Never Engaged (24h).<br />
                    Stop on reply: Yes.<br />
                    Max runs: 1
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <p className="text-center text-xs text-neutral-500">
        Example of improved automations card.
      </p>
    </div>
  );
};
