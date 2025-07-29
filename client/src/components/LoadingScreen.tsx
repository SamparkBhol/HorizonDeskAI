export default function LoadingScreen() {
  return (
    <div className="loading-matrix">
      <div className="text-center">
        <div className="matrix-grid mb-8">
          {Array.from({ length: 8 }, (_, i) => (
            <div 
              key={i}
              className="matrix-cube animate-pulse-glow animate-float"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + (i * 0.1)}s`
              }}
            />
          ))}
        </div>
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          HorizonDesk.AI
        </h2>
        <p className="text-lg text-gray-300 mb-6">
          Initializing AI-Enhanced Developer Platform...
        </p>
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}