"use client";

import { Play, Pause, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const demoFeatures = [
    {
      title: "Real-time Transcription",
      description: "Watch as Meeting Coach AI captures every word spoken in your meeting with 99% accuracy.",
      timestamp: "0:15"
    },
    {
      title: "AI-Powered Insights",
      description: "See how our AI identifies key decisions, action items, and important discussion points automatically.",
      timestamp: "0:45"
    },
    {
      title: "Smart Summaries",
      description: "Get instant meeting summaries with highlighted action items and assigned responsibilities.",
      timestamp: "1:20"
    },
    {
      title: "Action Item Tracking",
      description: "Automatically generated action items with deadlines and assignees for seamless follow-up.",
      timestamp: "1:50"
    }
  ];

  return (
    <section id="demo" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">See Meeting Coach AI in Action</h2>
          <p className="text-lg text-brand-body">
            Watch how Meeting Coach AI transforms a typical meeting into actionable insights in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-brand-dark transition-colors cursor-pointer">
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-white\" onClick={() => setIsPlaying(false)} />
                    ) : (
                      <Play className="h-8 w-8 text-white ml-1" onClick={() => setIsPlaying(true)} />
                    )}
                  </div>
                  <p className="text-white text-lg font-medium">Interactive Demo</p>
                  <p className="text-gray-300 text-sm">2:30 minutes</p>
                </div>
              </div>
              
              {/* Demo overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-sm">
                    <span className="text-brand-primary">1:23</span> / 2:30
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1 mt-3">
                  <div className="bg-brand-primary h-1 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-heading mb-6">What you'll see in this demo:</h3>
            
            {demoFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-brand-light transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-brand-heading">{feature.title}</h4>
                    <span className="text-sm text-brand-primary font-medium">{feature.timestamp}</span>
                  </div>
                  <p className="text-brand-body">{feature.description}</p>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button className="btn-primary w-full sm:w-auto">
                Start your free trial
              </button>
              <p className="text-sm text-brand-body mt-2">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;