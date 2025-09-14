import {
  BrainCircuit,
  FileText,
  FolderSyncIcon as Sync,
  MessageSquare,
  Clock,
  Shield,
  Search,
  Users,
} from "lucide-react"

const Features = () => {
  const mainFeatures = [
    {
      icon: <FileText className="h-12 w-12 text-brand-primary" />,
      title: "Real-time Transcription",
      description: "Get accurate, real-time transcription of your meetings with 98% accuracy across 30+ languages.",
      benefits: ["Live transcription", "Multi-language support", "Speaker identification", "Timestamp markers"],
    },
    {
      icon: <BrainCircuit className="h-12 w-12 text-brand-primary" />,
      title: "AI Summarization",
      description:
        "Automatically generate concise meeting summaries highlighting key decisions, action items, and next steps.",
      benefits: ["Key points extraction", "Action item detection", "Decision tracking", "Custom templates"],
    },
    {
      icon: <Sync className="h-12 w-12 text-brand-primary" />,
      title: "Universal Sync",
      description: "Seamlessly integrate with all major video conferencing platforms and productivity tools.",
      benefits: ["Cross-platform sync", "Calendar integration", "CRM connectivity", "API access"],
    },
  ]

  const additionalFeatures = [
    {
      icon: <MessageSquare className="h-8 w-8 text-brand-primary" />,
      title: "Smart Action Items",
      description: "Automatically extract and assign action items with deadlines and responsible parties.",
    },
    {
      icon: <Clock className="h-8 w-8 text-brand-primary" />,
      title: "Meeting Analytics",
      description: "Track meeting effectiveness, participation metrics, and follow-through rates.",
    },
    {
      icon: <Shield className="h-8 w-8 text-brand-primary" />,
      title: "Enterprise Security",
      description: "Bank-level encryption, SOC 2 compliance, and GDPR-ready data protection.",
    },
    {
      icon: <Search className="h-8 w-8 text-brand-primary" />,
      title: "Searchable Archive",
      description: "Find any discussion, decision, or commitment across all your meeting history.",
    },
    {
      icon: <Users className="h-8 w-8 text-brand-primary" />,
      title: "Team Collaboration",
      description: "Share summaries, collaborate on action items, and keep everyone aligned.",
    },
  ]

  return (
    <section id="features" className="section bg-brand-light">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Core Features That Transform Your Meetings</h2>
          <p className="text-lg text-brand-body">
            MeetIQ combines advanced AI with intuitive design to make every meeting more productive and actionable.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-subtle hover:shadow-hover transition-all duration-300 border border-gray-100 group hover:border-brand-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-brand-body mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-brand-primary rounded-full mr-3"></div>
                    <span className="text-brand-body">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="feature-card group hover:border-brand-primary"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-brand-body text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features