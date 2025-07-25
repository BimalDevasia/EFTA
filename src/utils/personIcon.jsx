// Utility function to generate colorful person icons
export const generatePersonIcon = (name, size = 'w-12 h-12') => {
  // Generate a color based on the name
  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600', 
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-red-400 to-red-600',
    'from-yellow-400 to-yellow-600',
    'from-teal-400 to-teal-600',
    'from-orange-400 to-orange-600',
    'from-cyan-400 to-cyan-600'
  ];
  
  // Use name to consistently pick a color
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const gradientClass = colors[colorIndex];
  
  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
      <svg
        className="w-2/3 h-2/3 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default generatePersonIcon;
