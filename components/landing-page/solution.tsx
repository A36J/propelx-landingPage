"use client";

import React from 'react';
import { GlowingEffect } from './ui/glowing-effect';

const Solution = () => {
  return (
    // 1. Added `relative` and `overflow-hidden` to the main container
    <div className="relative overflow-hidden py-20 bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 rounded-xl">
      
      {/* 2. Inserted the purple glow div */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-8 bg-violet-500/60 blur-[5rem] z-0"></div>
      
      {/* 3. Wrapped the content in a relative container with z-10 */}
      <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
        
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Bring the scientific method to marketing
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Propelx abstracts design, deployment, and analytics so marketers can focus on clean thinking.
        </p>
        
        <div className="flex justify-center"> 
          <div className="relative p-2"> 
            <GlowingEffect
              blur={0}
              borderWidth={1}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            
            <div className="relative z-10 inline-block px-6 py-3 rounded-full text-lg font-semibold bg-white dark:bg-gray-800 shadow-xl border border-purple-300 dark:border-purple-600">
              Hypothesize → Experiment → Validate → Learn → Iterate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solution;