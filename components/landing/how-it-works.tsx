import { CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Calendar',
      description: 'Integrate with Google Calendar, Microsoft Outlook, or other calendar apps to automatically join your scheduled meetings.',
      image: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      benefits: [
        'Automatic meeting detection',
        'One-click setup',
        'Works with all major calendar services'
      ]
    },
    {
      number: '02',
      title: 'Join Your Meetings',
      description: 'Meeting Coach AI joins your online meetings as a participant and quietly listens to the conversation.',
      image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      benefits: [
        'Works with Zoom, Teams, Google Meet & more',
        'No downloads required',
        'Joins automatically or with a click'
      ]
    },
    {
      number: '03',
      title: 'Get Instant Results',
      description: 'After your meeting, receive a detailed summary, action items, and searchable transcript within minutes.',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      benefits: [
        'Detailed meeting summaries',
        'Assigned action items with deadlines',
        'Searchable meeting archive'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">How Meeting Coach AI Works</h2>
          <p className="text-lg text-brand-body">
            A simple three-step process that transforms how you experience meetings.
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={`order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-brand-primary text-white text-xl font-bold p-4">
                    {step.number}
                  </div>
                </div>
              </div>
              
              <div className={`order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                <span className="text-brand-primary font-semibold">STEP {step.number}</span>
                <h3 className="text-3xl font-bold mt-2 mb-4">{step.title}</h3>
                <p className="text-lg text-brand-body mb-6">{step.description}</p>
                
                <ul className="space-y-3">
                  {step.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;