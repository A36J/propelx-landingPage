import Image from "next/image"; 
import Reason from "@/components/landing-page/reason";
import Capabilities from "@/components/landing-page/features-04";
import CTA from "@/components/landing-page/cta";
import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import Container from "@/components/landing-page/global/container";
import Wrapper from "@/components/landing-page/global/wrapper";
import Hero from "@/components/landing-page/hero";
import HowItWorks from "@/components/landing-page/howitworks";
import Navbar from "@/components/landing-page/navbar";
import { Problems } from "@/components/landing-page/problem";
import Solution from "@/components/landing-page/solution";
import { Spotlight } from "@/components/landing-page/ui/spotlight";
import Hyperspeed from "@/components/landing-page/hyperspeed";


const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* This is the full-screen hero section */}
      <div className="relative h-screen flex flex-col justify-between">

        {/* Hyperspeed background, now scoped to the hero section */}
        <div className="absolute inset-0 z-0 overflow-hidden">
        <Hyperspeed
          className="w-screen h-screen"
          effectOptions={{
            distortion: "mountainDistortion",
            speedUp: 1,
            fovSpeedUp: 10,
            colors: {
              roadColor: 0xffffff, // Background color
              islandColor: 0xffffff, // A very dark gray from your shoulderLines
              background: 0xffffff, // Your light mode background
              shoulderLines: 0xe8e8e8, // A lighter gray to stand out on the black road
              brokenLines: 0xe8e8e8,
              leftCars: [0x501b8a, 0x7c3aed, 0x9333ea], // Primary colors, purple shades
              rightCars: [0x054d85, 0x009bff, 0x00bfff], // Secondary colors, blue shades
              sticks: 0x501b8a, // Matches one of the primary car colors
            },
            fov:90,
          }}
        />
        </div>

        {/* Hero content and image side-by-side */}
        <div className="relative z-10 flex-grow flex items-center justify-between top-0">
          {/* Hero text on the left */}
          <div className="flex-1">
            <Wrapper>
              <Container className="relative">
                <Spotlight
                  className="-top-40 left-0 md:left-60 md:-top-20"
                  fill="rgba(255, 255, 255, 0.5)"
                />
                <Hero />
              </Container>
            </Wrapper>
          </div>

          {/* Image on the right, extending off screen */}
          <div className="flex-1 relative p-10">
            <Container delay={0.3}>
              <div className="relative mx-auto max-w-7xl rounded-xl lg:rounded-[32px] border p-2 backdrop-blur-lg border-neutral-700 bg-white md:p-4 mt-12 ">
                <div className="absolute top-1/4 left-1/2 -z-10 gradient w-3/4 -translate-x-1/2 h-1/4 -translate-y-1/2 inset-0 blur-[10rem]"></div>
                <div className="rounded-lg lg:rounded-[24px] border p-2 border-neutral-700 bg-neutral-600">
                  <Image
                    src="/canvas.png"
                    alt="canvas"
                    width={1920}
                    height={1080}
                    className="rounded-lg lg:rounded-[20px]"
                  />
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
      
      {/* The rest of the page content starts below the hero section */}
      <Wrapper>
        <Container delay={0.3}>
          <Problems />
        </Container>
        <Solution />
        <HowItWorks />
        {/* <FeaturesSection /> */}
        <Capabilities />
        <Reason/>
        <CTA />
      </Wrapper>

      <Footer />
    </div>
  );
};

export default HomePage;



