import Link from 'next/link';
import { Check, X } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "19",
      description: "Perfect for individuals and small teams",
      features: [
        "10 meetings per month",
        "Basic meeting summaries",
        "Action item tracking",
        "7-day transcript history",
        "Email support",
      ],
      notIncluded: [
        "Meeting analytics",
        "Custom templates",
        "API access",
        "Enterprise security",
      ],
      popular: false,
      cta: "Start free trial"
    },
    {
      name: "Professional",
      price: "49",
      description: "Ideal for growing teams and departments",
      features: [
        "Unlimited meetings",
        "Advanced AI summaries",
        "Action item tracking & notifications",
        "30-day transcript history",
        "Meeting analytics dashboard",
        "Custom meeting templates",
        "Priority support",
      ],
      notIncluded: [
        "API access",
        "Enterprise security",
      ],
      popular: true,
      cta: "Start free trial"
    },
    {
      name: "Enterprise",
      price: "99",
      description: "Advanced features for large organizations",
      features: [
        "Unlimited meetings",
        "Advanced AI summaries",
        "Action item tracking & notifications",
        "Unlimited transcript history",
        "Advanced analytics & reporting",
        "Custom meeting templates",
        "API access for integrations",
        "Enterprise-grade security",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      notIncluded: [],
      popular: false,
      cta: "Contact sales"
    }
  ];

  return (
    <section id="pricing" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-brand-body">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl overflow-hidden border ${
                plan.popular 
                  ? 'border-brand-primary shadow-lg relative' 
                  : 'border-gray-200 shadow-subtle'
              }`}
            >
              {plan.popular && (
                <div className="bg-brand-primary text-white text-center py-2 font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-brand-body mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-heading">${plan.price}</span>
                  <span className="text-brand-body">/month per user</span>
                </div>
                
                <Link 
                  href="#" 
                  className={`block text-center py-3 px-6 rounded-lg font-medium transition-colors mb-6 ${
                    plan.popular 
                      ? 'bg-brand-primary hover:bg-brand-dark text-white' 
                      : 'bg-white border border-brand-primary text-brand-primary hover:bg-brand-light'
                  }`}
                >
                  {plan.cta}
                </Link>
                
                <div className="space-y-4">
                  <p className="font-medium text-brand-heading">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-brand-body">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="font-medium text-brand-heading pt-4">Not included:</p>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;