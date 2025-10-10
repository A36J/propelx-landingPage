"use client";
import { animate, motion } from "motion/react";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { GoCopilot } from "react-icons/go";
import {
  FaMoneyBillWave,
  FaHandshake,
  FaComments,
  FaChartLine,
  FaQuestionCircle,
  FaShoppingCart, // For Shopify
} from "react-icons/fa";

// --- New/Updated Platform Logos (With Colors) ---

const MetaLogo = ({ className }) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 287.56 191"
  >
    <defs>
      <linearGradient
        id="meta-gradient-1"
        x1="62.34"
        y1="101.45"
        x2="260.34"
        y2="91.45"
        gradientTransform="matrix(1, 0, 0, -1, 0, 192)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#0064e1" />
        <stop offset="0.4" stopColor="#0064e1" />
        <stop offset="0.83" stopColor="#0073ee" />
        <stop offset="1" stopColor="#0082fb" />
      </linearGradient>
      <linearGradient
        id="meta-gradient-2"
        x1="41.42"
        y1="53"
        x2="41.42"
        y2="126"
        gradientTransform="matrix(1, 0, 0, -1, 0, 192)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#0082fb" />
        <stop offset="1" stopColor="#0064e0" />
      </linearGradient>
    </defs>
    <path
      fill="#0081fb"
      d="M31.06,126c0,11,2.41,19.41,5.56,24.51A19,19,0,0,0,53.19,160c8.1,0,15.51-2,29.79-21.76,11.44-15.83,24.92-38,34-52l15.36-23.6c10.67-16.39,23-34.61,37.18-47C181.07,5.6,193.54,0,206.09,0c21.07,0,41.14,12.21,56.5,35.11,16.81,25.08,25,56.67,25,89.27,0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191V160c17.63,0,22-16.2,22-34.74,0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85,0-26.8,11.2-40.23,31.17-7.14,10.61-14.47,23.54-22.7,38.13l-9.06,16c-18.2,32.27-22.81,39.62-31.91,51.75C84.74,183,71.12,191,53.19,191c-21.27,0-34.72-9.21-43-23.09C3.34,156.6,0,141.76,0,124.85Z"
    />
    <path
      fill="url(#meta-gradient-1)"
      d="M24.49,37.3C38.73,15.35,59.28,0,82.85,0c13.65,0,27.22,4,41.39,15.61,15.5,12.65,32,33.48,52.63,67.81l7.39,12.32c17.84,29.72,28,45,33.93,52.22,7.64,9.26,13,12,19.94,12,17.63,0,22-16.2,22-34.74l27.4-.86c0,19.38-3.82,33.62-10.32,44.87C271,180.13,258.72,191,238.13,191c-12.8,0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71L146.08,93.6c-12.94-21.62-24.81-37.74-31.68-45C107,40.71,97.51,31.23,82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78Z"
    />
    <path
      fill="url(#meta-gradient-2)"
      d="M82.35,31.23c-12.27,0-22.69,8.61-31.41,21.78C38.61,71.62,31.06,99.34,31.06,126c0,11,2.41,19.41,5.56,24.51L10.14,167.91C3.34,156.6,0,141.76,0,124.85,0,94.1,8.44,62.05,24.49,37.3,38.73,15.35,59.28,0,82.85,0Z"
    />
  </svg>
);

const GoogleAdsLogo = ({ className }) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect width="24" height="24" rx="4" fill="#34A853" />
    <path
      d="M17.85 17.85H6.15V6.15H17.85V17.85ZM12 7.5C9.52 7.5 7.5 9.52 7.5 12C7.5 14.48 9.52 16.5 12 16.5C14.48 16.5 16.5 14.48 16.5 12C16.5 9.52 14.48 7.5 12 7.5ZM12 15C10.62 15 9.5 13.88 9.5 12C9.5 10.12 10.62 9 12 9C13.38 9 14.5 10.12 14.5 12C14.5 13.88 13.38 15 12 15Z"
      fill="white"
    />
  </svg>
);

const TikTokLogo = ({ className }) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12.5 5.75V17.25C12.5 19.5637 10.6137 21.45 8.3 21.45C5.98634 21.45 4.1 19.5637 4.1 17.25C4.1 14.9363 5.98634 13.05 8.3 13.05C8.89117 13.05 9.45831 13.1769 9.97658 13.4116L9.97658 9.77884C9.54013 9.68285 9.07923 9.63385 8.61834 9.63385C5.18346 9.63385 2.45 12.3673 2.45 15.8016C2.45 19.2358 5.18346 21.9693 8.61834 21.9693C12.0526 21.9693 14.7861 19.2358 14.7861 15.8016V5.75H12.5ZM18.5 7.75V19.25C18.5 21.5637 16.6137 23.45 14.3 23.45C11.9863 23.45 10.1 21.5637 10.1 19.25C10.1 16.9363 11.9863 15.05 14.3 15.05C14.8912 15.05 15.4583 15.1769 15.9766 15.4116L15.9766 11.7788C15.5401 11.6828 15.0792 11.6338 14.6183 11.6338C11.1835 11.6338 8.45 14.3673 8.45 17.8016C8.45 21.2358 11.1835 23.9693 14.6183 23.9693C18.0526 23.9693 20.7861 21.2358 20.7861 17.8016V7.75H18.5Z"
      fill="#00F2EA" // Cyan shadow
    />
    <path
      d="M12.5 5.75V17.25C12.5 19.5637 10.6137 21.45 8.3 21.45C5.98634 21.45 4.1 19.5637 4.1 17.25C4.1 14.9363 5.98634 13.05 8.3 13.05C8.89117 13.05 9.45831 13.1769 9.97658 13.4116L9.97658 9.77884C9.54013 9.68285 9.07923 9.63385 8.61834 9.63385C5.18346 9.63385 2.45 12.3673 2.45 15.8016C2.45 19.2358 5.18346 21.9693 8.61834 21.9693C12.0526 21.9693 14.7861 19.2358 14.7861 15.8016V5.75H12.5Z"
      fill="#FE2C55" // Red main color
    />
  </svg>
);

const ShopifyLogo = ({ className }) => (
  <svg
    className={cn(className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#96BF48" // Shopify Green
  >
    <path d="M21.571 5.429a2.43 2.43 0 00-2.43-2.43H4.857a2.43 2.43 0 00-2.43 2.43v13.142a2.43 2.43 0 002.43 2.43h14.286a2.43 2.43 0 002.43-2.43V5.429zM12 16.286a4.286 4.286 0 110-8.572 4.286 4.286 0 010 8.572zm0-6.143a1.857 1.857 0 100 3.714 1.857 1.857 0 000-3.714z" />
  </svg>
);

// Generic report icon (Blue for professionalism/documentation)
const ReportIcon = ({ className }) => (
  <svg
    className={cn(className, "text-blue-500")}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  </svg>
);

// Graph pointing downwards (Red for poor performance/loss)
const GraphDownIcon = ({ className }) => (
  <svg
    className={cn(className, "text-red-500")}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 18H8v2h8v-2zm-3.5-6.5L11 9l-1.5 2.5H7l3.5-6L14 9h-2.5l-3.5-6zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

export function Problems() {
  const problemCards = [
    {
      title: "Juggling Budgets & Agencies",
      description:
        "Time drained managing stakeholders instead of focusing on growth.",
      iconType: "budget-agencies",
    },
    {
      title: "Scattered Experiments",
      description:
        "No clear thread of thinking or centralized tracking across platforms.",
      iconType: "scattered-platforms",
    },
    {
      title: "Lost Learnings",
      description:
        "Hard to replicate wins or build on past experiments effectively.",
      iconType: "lost-learnings",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 md:mb-16">
        Marketers spend more time managing chaos than creating growth
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {problemCards.map((card, index) => (
          <Card key={index} className="w-full">
            <CardSkeletonContainer>
              <Skeleton iconType={card.iconType} />
            </CardSkeletonContainer>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}

const Skeleton = ({ iconType }) => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequenceConfig = { duration: 0.8 };

  const getIconsForType = (type) => {
    switch (type) {
      case "budget-agencies":
        return [
          {
            Component: FaMoneyBillWave,
            className: "h-8 w-8 circle-1 text-green-500",
          },
          {
            Component: FaHandshake,
            className: "h-12 w-12 circle-2 text-yellow-500",
          },
          {
            Component: FaComments,
            className: "circle-3 text-purple-500",
          },
        ];
      case "scattered-platforms":
        return [
          { Component: MetaLogo, className: "h-8 w-8 circle-1" },
          { Component: GoogleAdsLogo, className: "h-12 w-12 circle-2" },
          { Component: ShopifyLogo, className: "circle-3" },
          { Component: TikTokLogo, className: "h-12 w-12 circle-4" },
        ];
      case "lost-learnings":
        return [
          { Component: ReportIcon, className: "h-8 w-8 circle-1" },
          { Component: GraphDownIcon, className: "h-12 w-12 circle-2" },
          {
            Component: FaQuestionCircle,
            className: "circle-3 text-orange-500",
          },
        ];
      default:
        return [{ Component: GoCopilot, className: "h-12 w-12 circle-2" }];
    }
  };

  const icons = getIconsForType(iconType);

  useEffect(() => {
    const animationSequence = icons.map((_, i) => [
      `.circle-${i + 1}`,
      { scale, transform },
      sequenceConfig,
    ]);

    if (animationSequence.length > 0) {
      animate(animationSequence, {
        // @ts-ignore
        repeat: Infinity,
        repeatDelay: 1,
      });
    }
  }, [iconType, icons]);

  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        {icons.map((icon, i) => (
          <Container key={i} className={icon.className}>
            <icon.Component className="h-6 w-6" />
          </Container>
        ))}
      </div>

      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};

const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-neutral-200 dark:bg-[rgba(40,40,40,0.70)] bg-white-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-800 dark:text-white py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-purple-100 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className
      )}
    >
      {children}
    </div>
  );
};