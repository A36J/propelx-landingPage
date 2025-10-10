import React from "react";
// You would typically import cn from "@/lib/utils" if this was a real project
// const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- Data Definition (Taken from the Bento Grid component) ---
const stepsData = [
  { title: "Enter Product Description and Create Hypotheses", description: "Propelx suggests hypotheses based on your product details and context." },
  { title: "Choose Hypotheses to Validate", description: "Select the most relevant ones to test." },
  { title: "Experiments Designed and Budget Sign-off", description: "Align your budget and convert chosen hypotheses into ready-to-run experiments." },
  
  { title: "Creative Briefs for Agencies", description: "Auto-generate structured briefs for quick production." },
  { title: "One-Click Deployment", description: "Launch to Meta & Google without juggling platforms." },
  { title: "Conversational Analytics", description: "Ask questions like “What worked last week?” and get answers." },
  { title: "Iterate & Improve", description: "Every learning feeds the next cycle automatically." },
];


// --- Vertical Timeline Component with Bento Grid Content ---

export default function HowItWorks() {
  return (
    // Outer container for centering and padding
    <div className="max-w-2xl mx-auto py-0 md:py-20 px-6 bg-white dark:bg-gray-950">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white mb-12">
          How It Works
      </h2>
      
      {/* Timeline wrapper and line */}
      <div className="relative ml-6">
        {/* The main vertical line */}
        <div className="absolute left-0 inset-y-0 border-l-2 border-indigo-200 dark:border-indigo-800" />

        {stepsData.map(({ title, description }, index) => (
          <div key={index} className="relative pl-10 pb-12 last:pb-0">
            
            {/* Timeline Icon / Step Number (Styled like the CustomGlowingHeader) */}
            <div className="absolute left-px -translate-x-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xl ring-8 ring-white dark:ring-gray-950 shadow-lg dark:bg-indigo-600">
              {/* The index starts at 0, so we add 1 for the step number */}
              <span className="relative z-10">{index + 1}</span>
            </div>

            {/* Content Container */}
            <div className="pt-1 space-y-1 bg-white dark:bg-gray-950 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}