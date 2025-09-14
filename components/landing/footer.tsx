import Link from "next/link";
import {
  Mail,
  PhoneCall,
  MapPin,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
        { name: "Use Cases", href: "#" },
        { name: "Integrations", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "API Documentation", href: "#" },
        { name: "Security", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            {/* <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-brand-heading">Meeting Coach AI</span>
            </Link> */}

            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                <Image
                  src="/logo.png" // Change to your actual image path
                  alt="Meeting Coach AI Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-xl text-brand-heading">
                Meet IQ
              </span>
            </Link>

            <p className="text-brand-body mb-6 max-w-md">
              Meeting Coach AI transforms your meetings with intelligent AI that
              captures notes, action items, and insights so you can focus on the
              conversation.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-brand-body">contact@meetingcoach.ai</span>
              </div>
              <div className="flex items-start">
                <PhoneCall className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-brand-body">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-brand-body">
                  123 AI Avenue, San Francisco, CA 94103
                </span>
              </div>
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index}>
              <h4 className="font-semibold text-lg mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-brand-body hover:text-brand-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-brand-body text-sm mb-4 md:mb-0">
            © {currentYear} Meeting Coach AI. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <a
              href="#"
              className="text-brand-body hover:text-brand-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-brand-body hover:text-brand-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="text-brand-body hover:text-brand-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="text-brand-body hover:text-brand-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
