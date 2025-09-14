const Integrations = () => {
  const integrations = [
    {
      name: "Google Meet",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg",
      description: "Native integration with Google Meet",
    },
    {
      name: "Zoom",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
      description: "Seamless Zoom meeting integration",
    },
    {
      name: "Microsoft Teams",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg",
      description: "Full Microsoft Teams support",
    },
    // {
    //   name: "Slack",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    //   description: "Share summaries in Slack channels",
    // },
    {
      name: "Google Calendar",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
      description: "Automatic calendar integration",
    },
    // {
    //   name: "Notion",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    //   description: "Export summaries to Notion",
    // },
    // {
    //   name: "Asana",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg",
    //   description: "Create tasks from action items",
    // },
    // {
    //   name: "Trello",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Trello-logo-blue.svg",
    //   description: "Add cards from meeting notes",
    // },
  ]

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Works With Your Favorite Tools</h2>
          <p className="text-lg text-brand-body">
            MeetIQ integrates seamlessly with the platforms and tools you already use every day.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl hover:bg-brand-light transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={integration.logo || "/placeholder.svg"}
                  alt={integration.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="font-semibold text-center mb-2">{integration.name}</h3>
              <p className="text-sm text-brand-body text-center">{integration.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-brand-body mb-6">Don't see your tool? We're constantly adding new integrations.</p>
          <button className="btn-secondary">Request Integration</button>
        </div>
      </div>
    </section>
  )
}

export default Integrations