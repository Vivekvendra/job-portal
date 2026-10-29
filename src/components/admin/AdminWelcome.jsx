import React from 'react';

export const AdminWelcome = () => {
  return (
    <div className="flex items-center gap-4 sm:gap-5 text-left pt-2 pb-6">
      {/* Vivek Circular Avatar with Thick White Ring */}
      <div className="relative shrink-0">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80"
          alt="Vivek"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
        />
      </div>

      {/* Greeting Typography */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Welcome Back, Vivek</span>
          <span className="inline-block hover:rotate-12 transition-transform duration-200">👋</span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
          Here's your recruitment overview
        </p>
      </div>
    </div>
  );
};
