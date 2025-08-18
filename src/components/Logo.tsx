import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const eyeSize = {
    sm: 'w-1.5 h-2',
    md: 'w-2 h-2.5',
    lg: 'w-3 h-4'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Outer ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-cyan-400 to-blue-400 p-0.5">
        {/* Inner circle with gradient */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-300 via-green-300 to-cyan-400 flex items-center justify-center relative">
          {/* Eyes */}
          <div className="flex space-x-1">
            <div className={`${eyeSize[size]} bg-slate-800 rounded-full`}></div>
            <div className={`${eyeSize[size]} bg-slate-800 rounded-full`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;