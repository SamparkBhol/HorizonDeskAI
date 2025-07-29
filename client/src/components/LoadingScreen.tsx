import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

interface GameStats {
  level: number;
  experience: number;
  streak: number;
  achievements: string[];
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting game...');
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    experience: 0,
    streak: 0,
    achievements: []
  });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);

    const gameSteps = [
      { progress: 10, text: '🎮 Starting new game session...', level: 1, exp: 50, streak: 1 },
      { progress: 25, text: '⚡ Loading player profile...', level: 2, exp: 150, streak: 2 },
      { progress: 40, text: '🚀 Initializing development environment...', level: 3, exp: 300, streak: 3 },
      { progress: 55, text: '🔧 Connecting to AI systems...', level: 4, exp: 500, streak: 4 },
      { progress: 70, text: '🛡️ Activating security protocols...', level: 5, exp: 750, streak: 5 },
      { progress: 85, text: '⭐ Unlocking premium features...', level: 6, exp: 1000, streak: 6 },
      { progress: 100, text: '🎉 Game ready! Welcome back, Developer!', level: 7, exp: 1337, streak: 7 }
    ];

    const achievements = [
      '🏆 First Login',
      '⚡ Speed Coder',
      '🔥 Hot Streak',
      '🎯 Precision Master',
      '🚀 Productivity Boost',
      '💎 Elite Developer',
      '🌟 Code Wizard'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < gameSteps.length) {
        const step = gameSteps[currentStep];
        setProgress(step.progress);
        setLoadingText(step.text);
        
        setGameStats(prev => ({
          level: step.level,
          experience: step.exp,
          streak: step.streak,
          achievements: currentStep < achievements.length 
            ? [...prev.achievements, achievements[currentStep]]
            : prev.achievements
        }));
        
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onLoadingComplete, 1000);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Animated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}

      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-emerald-400 text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {Math.random().toString(36).substring(7)}
          </div>
        ))}
      </div>

      <div className="glass-panel-dark rounded-3xl p-8 w-[500px] max-w-md mx-4 relative overflow-hidden">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 rounded-3xl animate-pulse" />
        
        <div className="relative z-10">
          {/* Game-style header */}
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-spin" 
                   style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              HorizonDesk.AI
            </h1>
            <p className="text-emerald-400/80 text-sm mt-1 font-mono">Elite Developer Platform</p>
          </div>

          {/* Game stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-emerald-400 font-bold text-lg">{gameStats.level}</div>
              <div className="text-xs text-gray-400">LEVEL</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-cyan-400 font-bold text-lg">{gameStats.experience}</div>
              <div className="text-xs text-gray-400">EXP</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-yellow-400 font-bold text-lg">{gameStats.streak}</div>
              <div className="text-xs text-gray-400">STREAK</div>
            </div>
          </div>

          {/* Loading progress */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Progress value={progress} className="h-3 bg-gray-800" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full animate-pulse" />
            </div>
            <p className="text-center text-emerald-300 text-sm font-mono animate-pulse">
              {loadingText}
            </p>
          </div>

          {/* Recent achievements */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2">RECENT ACHIEVEMENTS</div>
            <div className="space-y-1 max-h-16 overflow-hidden">
              {gameStats.achievements.slice(-3).map((achievement, index) => (
                <div key={index} className="text-xs text-emerald-400 animate-fade-in">
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}