import Link from 'next/link';
import { Play, ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-brand-background via-white to-brand-light">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="inline-flex items-center bg-brand-light border border-brand-primary/20 rounded-full px-4 py-2 mb-6">
                <span className="text-brand-primary font-semibold text-sm">🚀 AI-POWERED MEETING ASSISTANT</span>
              </div>
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Turn Meetings into <span className="gradient-text">Actionable Insights</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-body max-w-xl leading-relaxed">
                Meeting Coach AI takes notes, summarizes key points, and creates action items from your meetings, so you can focus on the conversation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Try for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#demo" className="btn-secondary text-lg px-8 py-4 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Watch demo
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-brand-primary font-medium text-xs">{i}</span>
                    </div>
                  ))}
                </div>
                <p className="text-brand-body font-medium">
                  <span className="font-bold text-brand-primary">5,000+</span> professionals already using Meeting Coach AI
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center text-sm text-brand-body">
                <CheckCircle className="h-4 w-4 text-brand-primary mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center text-sm text-brand-body">
                <CheckCircle className="h-4 w-4 text-brand-primary mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center text-sm text-brand-body">
                <CheckCircle className="h-4 w-4 text-brand-primary mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white">
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs text-gray-500 ml-4">Meeting Coach AI Dashboard</span>
              </div>
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Meeting Coach AI in action"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <div className="bg-black/70 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Live Meeting Summary
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="bg-brand-primary rounded-full w-4 h-4 mt-1 mr-3 flex-shrink-0"></span>
                        <span>Decision to launch new product by Q3</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-brand-secondary rounded-full w-4 h-4 mt-1 mr-3 flex-shrink-0"></span>
                        <span>John to prepare marketing strategy by Friday</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-brand-warning rounded-full w-4 h-4 mt-1 mr-3 flex-shrink-0"></span>
                        <span>Budget approval needed by end of week</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 -z-10 w-72 h-72 bg-brand-secondary rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -top-8 -left-8 -z-10 w-72 h-72 bg-brand-primary rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;