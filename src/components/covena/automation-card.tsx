import {
  ChevronDownIcon,
  EyeIcon,
  MoreVerticalIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const AutomationCard = () => {
  return (
    <div className="space-y-2">
      <Card className="relative isolate aspect-[4/3] w-full overflow-hidden py-0">
        <div className="flex min-h-full flex-col gap-4 overflow-y-scroll p-6">
          <Card className="bg-background flex w-full flex-col rounded-md border-l-4 border-l-[#4B86E3] p-4 py-4">
            <div className="grid grid-cols-[2rem_1fr] items-center gap-4">
              <ChevronDownIcon />
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">New Automation</h3>
                    <span className="flex h-5 items-center rounded-full bg-green-500/10 px-2 text-xs font-medium text-green-500">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Trigger: Customer Never Engaged (24h).
                    <br />
                    Stop on reply: Yes.
                    <br />
                    Max runs: 1
                  </p>
                </div>

                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="size-7">
                        <PauseIcon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pause Automation</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="size-7">
                        <PencilIcon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Automation</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7">
                            <MoreVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More Options</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="dark text-xs">
                      <DropdownMenuItem>
                        <EyeIcon />
                        View Automation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrashIcon />
                        Delete Automation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-background flex w-full flex-col rounded-md border-l-4 border-l-[#4B86E3] p-4 py-4">
            <div className="grid grid-cols-[2rem_1fr] items-center gap-4">
              <ChevronDownIcon />
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">New Automation</h3>
                    <span className="flex h-5 items-center rounded-full bg-neutral-500/10 px-2 text-xs font-medium text-neutral-500">
                      Paused
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Trigger: Customer Never Engaged (24h).
                    <br />
                    Stop on reply: Yes.
                    <br />
                    Max runs: 1
                  </p>
                </div>

                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="size-7">
                        <PlayIcon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start Automation</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="size-7">
                        <PencilIcon className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Automation</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7">
                            <MoreVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More Options</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="dark text-xs">
                      <DropdownMenuItem>
                        <EyeIcon />
                        View Automation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrashIcon />
                        Delete Automation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>

          {[...Array(2)].map((_, i) => (
            <Card
              key={i}
              className="bg-background flex w-full flex-col rounded-md border-l-4 border-l-[#4B86E3] p-4 py-4">
              <div className="grid grid-cols-[2rem_1fr] items-center gap-4">
                <ChevronDownIcon />
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <h3 className="text-sm font-semibold">New Automation</h3>
                      <span className="flex h-5 items-center rounded-full bg-green-500/10 px-2 text-xs font-medium text-green-500">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500">
                      Trigger: Customer Never Engaged (24h).
                      <br />
                      Stop on reply: Yes.
                      <br />
                      Max runs: 1
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7">
                          <PauseIcon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pause Automation</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7">
                          <PencilIcon className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Automation</p>
                      </TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7">
                              <MoreVerticalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More Options</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="dark text-xs">
                        <DropdownMenuItem>
                          <EyeIcon />
                          View Automation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrashIcon />
                          Delete Automation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
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
