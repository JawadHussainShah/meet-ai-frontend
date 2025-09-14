import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Meeting Coach AI has revolutionized how our team collaborates. We spend less time taking notes and more time engaging in meaningful discussions. The action item tracking alone has saved us hours every week.",
      author: "Sarah Johnson",
      position: "Product Manager",
      company: "TechCorp",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      rating: 5,
      metrics: "Saved 5+ hours per week"
    },
    {
      quote: "The action item tracking alone has increased our team's productivity by 30%. Nothing falls through the cracks anymore. The AI summaries are incredibly accurate and help keep everyone aligned.",
      author: "Michael Chen",
      position: "Director of Operations",
      company: "Innovate Inc",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      rating: 5,
      metrics: "30% productivity increase"
    },
    {
      quote: "As a remote team, having detailed transcripts and summaries helps everyone stay aligned. It's like having a business analyst in every meeting. The search functionality is a game-changer.",
      author: "Emily Rodriguez",
      position: "VP of Marketing",
      company: "Growth Partners",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      rating: 5,
      metrics: "100% team alignment"
    },
    {
      quote: "The real-time suggestions during meetings have improved our discussion quality significantly. Our meetings are now more focused and productive than ever before.",
      author: "David Kim",
      position: "Engineering Manager",
      company: "DevFlow",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      rating: 5,
      metrics: "50% better meeting quality"
    },
    {
      quote: "Meeting Coach AI integrates seamlessly with our existing tools. The setup was effortless, and the results were immediate. Our team loves the automated follow-ups.",
      author: "Lisa Thompson",
      position: "Operations Director",
      company: "ScaleUp Co",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      rating: 5,
      metrics: "Zero setup friction"
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. We can now track meeting effectiveness and continuously improve our collaboration processes.",
      author: "Robert Martinez",
      position: "Chief Technology Officer",
      company: "DataDriven",
      avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2",
      rating: 5,
      metrics: "Complete meeting visibility"
    }
  ];

  const companies = [
    "TechCorp", "Innovate Inc", "Growth Partners", "DevFlow", "ScaleUp Co", "DataDriven"
  ];

  return (
    <section id="testimonials" className="section bg-brand-light">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Trusted by Teams Worldwide</h2>
          <p className="text-lg text-brand-body">
            Discover how Meeting Coach AI is transforming meetings for teams of all sizes across different industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-subtle hover:shadow-hover transition-all duration-300 border border-gray-100 group hover:border-brand-primary/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-brand-primary/30 group-hover:text-brand-primary/50 transition-colors" />
              </div>
              
              <blockquote className="text-brand-body mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-brand-light"
                  />
                  <div>
                    <p className="font-semibold text-brand-heading">{testimonial.author}</p>
                    <p className="text-sm text-brand-body">{testimonial.position}</p>
                    <p className="text-xs text-brand-primary font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-brand-light rounded-lg p-3">
                  <p className="text-sm font-medium text-brand-primary">{testimonial.metrics}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-brand-body mb-8 font-medium">TRUSTED BY FORWARD-THINKING COMPANIES</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="text-lg font-bold text-brand-heading opacity-60 hover:opacity-100 transition-opacity">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;