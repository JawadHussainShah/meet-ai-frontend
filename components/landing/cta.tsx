import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="section bg-brand-primary text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Meetings?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of professionals who are saving time, increasing productivity, and making their meetings matter.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="#" 
              className="bg-white text-brand-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 inline-flex items-center justify-center text-lg"
            >
              Start your free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="#" 
              className="bg-transparent border border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-all duration-200 inline-flex items-center justify-center text-lg"
            >
              Request a demo
            </Link>
          </div>
          
          <p className="mt-6 text-white/80">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;