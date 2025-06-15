const LoadingSpinner = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-t-[#0029ff] border-r-[#0029ff]"></div>
        <div className="absolute inset-4 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#0029ff] opacity-20"></div>
      </div>
      <p className="text-lg font-medium text-gray-700">Loading your content</p>
    </div>
  );
};

export default LoadingSpinner; 