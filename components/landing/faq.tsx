"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Meeting Coach AI join my meetings?",
      answer: "Meeting Coach AI integrates with popular video conferencing platforms like Zoom, Microsoft Teams, Google Meet, and more. You can invite it to meetings manually or set up automatic joining through calendar integration. The AI joins as a participant and quietly listens to capture and analyze the conversation."
    },
    {
      question: "Is my meeting data secure and private?",
      answer: "Absolutely. We use bank-level encryption to protect your data both in transit and at rest. Your meeting recordings and transcripts are stored securely and are only accessible to authorized users in your organization. We're SOC 2 compliant and follow strict data privacy regulations including GDPR."
    },
    {
      question: "What languages does Meeting Coach AI support?",
      answer: "Meeting Coach AI currently supports over 30 languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese (Mandarin), Japanese, Korean, and many more. The AI can detect the primary language automatically and provide transcriptions and summaries in that language."
    },
    {
      question: "Can I customize the meeting summaries and action items?",
      answer: "Yes! Meeting Coach AI offers customizable templates for different meeting types (standup, planning, review, etc.). You can also set custom prompts to focus on specific aspects of your meetings and configure how action items are formatted and assigned."
    },
    {
      question: "How accurate are the transcriptions and summaries?",
      answer: "Our AI achieves 95%+ accuracy in transcription for clear audio in supported languages. The accuracy of summaries and action item extraction is continuously improving through machine learning. You can always edit and refine the outputs to match your specific needs."
    },
    {
      question: "What integrations are available?",
      answer: "Meeting Coach AI integrates with popular productivity tools including Slack, Microsoft Teams, Asana, Trello, Jira, Notion, and more. We also offer API access for custom integrations. Calendar integration works with Google Calendar, Outlook, and other major calendar applications."
    },
    {
      question: "How much does Meeting Coach AI cost?",
      answer: "We offer three pricing tiers: Starter ($19/month), Professional ($49/month), and Enterprise ($99/month). All plans include a 14-day free trial with no credit card required. Pricing is per user per month, and you can upgrade or downgrade at any time."
    },
    {
      question: "Can I try Meeting Coach AI before purchasing?",
      answer: "Yes! We offer a 14-day free trial that includes access to all Professional features. No credit card is required to start your trial. You can test the AI with your actual meetings to see how it works for your team before making a commitment."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-brand-body">
            Get answers to common questions about Meeting Coach AI and how it can transform your meetings.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-brand-primary/30 transition-colors"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-brand-light/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="font-semibold text-brand-heading pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-brand-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-brand-primary flex-shrink-0" />
                  )}
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-6 pb-4">
                    <p className="text-brand-body leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-brand-body mb-4">Still have questions?</p>
          <button className="btn-secondary">
            Contact our support team
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;