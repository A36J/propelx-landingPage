const Reason = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 rounded-xl text-center">
      
      {/* The blur has been reduced from 10rem to 6rem for a more subtle effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-12 bg-violet-500/60 blur-[6rem]"></div>

      <div className="relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Why Propelx?
        </h2>

        <div className="mt-8 space-y-4 text-xl text-gray-600 dark:text-gray-400">
          <p>❌ Dashboards = raw data, no thinking</p>
          <p>❌ Agencies = execution, but no knowledge loop</p>
          <p>✅ Propelx = your thinking, your experiments, your growth engine</p>
        </div>
      </div>
      
    </section>
  );
};

export default Reason;