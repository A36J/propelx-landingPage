import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
// --- New Lucide Imports for the features ---
import {
  BarChart4, // For Experiment Tracking/Analytics
  MessageSquareText, // For Conversational Analytics
  Rocket, // For Smart Experiment Launch
  Target, // For Unified Control
} from "lucide-react";

// --- New Content with Lucide Icons ---
const features = [
  {
    icon: BarChart4,
    title: "Experiment Tracking",
    description: "See exactly what’s running, why, and what you’ll learn.",
  },
  {
    icon: MessageSquareText,
    title: "Conversational Analytics",
    description: "Ask natural questions and get instant insights.",
  },
  {
    icon: Rocket,
    title: "Smart Experiment Launch",
    description: "Deploy new tests that build on past learnings.",
  },
  {
    icon: Target,
    title: "Unified Control",
    description: "Budgets, channels, creatives all tied back to hypotheses.",
  },
];

// --- Chat Skeleton Component (Remains the same) ---
const ChatSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 p-4 h-full">
      {/* Incoming Message Skeleton */}
      <div className="flex justify-start">
        <div className="space-y-2 w-3/4">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-6 w-full rounded-xl rounded-tl-sm" />
          <Skeleton className="h-6 w-2/3 rounded-xl rounded-tl-sm" />
        </div>
      </div>

      {/* Outgoing Message Skeleton */}
      <div className="flex justify-end">
        <div className="space-y-2 w-3/5">
          <Skeleton className="h-6 w-full rounded-xl rounded-br-sm" />
        </div>
      </div>

      {/* Incoming Message Skeleton (Follow-up) */}
      <div className="flex justify-start">
        <div className="space-y-2 w-1/2">
          <Skeleton className="h-6 w-full rounded-xl rounded-tl-sm" />
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="mt-auto pt-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
};

// --- Updated Features Component ---
const Capabilities = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl w-full py-0 px-6">
        <h2 className="text-4xl md:text-5xl md:leading-14 font-semibold tracking-[-0.03em] max-w-lg">
          Key Capabilities
        </h2>
        <div className="mt-6 md:mt-10 w-full mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <Accordion defaultValue="item-0" type="single" className="w-full">
              {features.map(({ title, description, icon: Icon }, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="group/accordion-item data-[state=open]:border-b-2 data-[state=open]:border-primary"
                >
                  <AccordionTrigger className="text-lg [&>svg]:hidden group-first/accordion-item:pt-0">
                    <div className="flex items-center gap-4">
                      {/* Using the Lucide Icon Component */}
                      <Icon className="w-6 h-6" /> 
                      {title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground">
                    {description}
                    <div className="mt-6 mb-2 md:hidden aspect-video w-full bg-muted rounded-xl" />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Media - ChatSkeleton */}
          <div className="hidden md:block w-full bg-muted rounded-xl">
            <ChatSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capabilities;