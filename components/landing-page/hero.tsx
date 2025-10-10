"use client"; // 1. Convert to a Client Component

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { Button } from "../ui/button";
import Container from "./global/container";
import { onSignUp } from "@/app/actions/signup";


const words = [
    {
      text: "The",
    },
    {
      text: "AI",
    },
    {
      text: "D2C",
    },
    {
      text: "Growth",
    },
    {
      text: "Lab",
    },
];

const Hero = () => {
    // 3. Add state for email, loading status, and feedback message
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', isError: false });

    // 4. Handle the form submission
    const handleSubmit = async () => {
        if (!email) {
            setFeedback({ message: 'Please enter a valid email.', isError: true });
            return;
        }

        setIsLoading(true);
        setFeedback({ message: '', isError: false }); // Clear previous feedback

        const response = await onSignUp({ email });

        if (response.success) {
            setFeedback({ message: 'Success! You have been signed up.', isError: false });
            setEmail(''); // Clear the input field on success
        } else {
            // A more specific error for when an email is already registered
            if (response.error?.includes('Unique constraint failed')) {
                 setFeedback({ message: 'This email is already registered.', isError: true });
            } else {
                 setFeedback({ message: 'An error occurred. Please try again.', isError: true });
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center text-center w-full max-w-5xl my-0 mx-auto z-40 relative">
            <Container delay={0.0}>
                <div className="pl-2 pr-1 py-1 rounded-full border border-foreground/10 hover:border-foreground/15 backdrop-blur-lg cursor-pointer flex items-center gap-2.5 select-none w-max mx-auto">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary/40 flex items-center justify-center relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping"></div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        </div>
                    </div>
                    <span className="inline-flex items-center justify-center gap-2 animate-text-gradient animate-background-shine bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent">
                        Build for the future of marketing
                    </span>
                </div>
            </Container>
            
            <div className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent py-2 md:py-0 lg:!leading-snug font-medium racking-[-0.0125em] mt-6 font-heading">
                <TypewriterEffectSmooth words={words} />
            </div>

            <Container delay={0.1}>
                <p className="text-sm sm:text-base lg:text-lg mt-4 text-accent-foreground/60 max-w-2xl mx-auto">
                    Transform marketing chaos into measurable outcomes.
                </p>
            </Container>

            {/* --- MODIFIED SECTION START --- */}
            <Container delay={0.2}>
                <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-8">
                    <div className="flex items-center justify-center w-full md:gap-x-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />

                        <Button size="lg" onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Booking...' : 'Book demo'}
                        </Button>
                    </div>
                    
                    {/* 5. Display feedback message */}
                    {feedback.message && (
                        <p className={`mt-3 text-sm ${feedback.isError ? 'text-red-500' : 'text-green-500'}`}>
                            {feedback.message}
                        </p>
                    )}
                </div>
            </Container>
             {/* --- MODIFIED SECTION END --- */}
        </div>
    )
};

export default Hero;