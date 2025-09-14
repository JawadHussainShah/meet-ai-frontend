"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Demo", href: "#demo" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed w-full z-50 transition-all duration-200",
          isScrolled ? "bg-white shadow-sm py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container-custom flex items-center justify-between">
          {/* <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-xl text-brand-heading">Meeting Coach AI</span>
          </Link> */}

          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
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

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-brand-heading hover:text-brand-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-brand-heading hover:text-brand-primary transition-colors font-medium"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Try for free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-brand-heading"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile navigation */}
        <div
          className={cn(
            "md:hidden absolute w-full bg-white shadow-md transition-all duration-300 ease-in-out",
            isOpen ? "max-h-screen py-5" : "max-h-0 overflow-hidden py-0"
          )}
        >
          <div className="container-custom flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-brand-heading hover:text-brand-primary py-2 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
              <Link
                href="#"
                className="text-brand-heading hover:text-brand-primary transition-colors font-medium"
              >
                Log in
              </Link>
              <Link href="#" className="btn-primary w-full text-center">
                Try for free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky CTA for better accessibility */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-40 transition-all duration-300",
          isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Link
          href="#"
          className="bg-brand-primary hover:bg-brand-dark text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center"
        >
          Get Started
        </Link>
      </div>
    </>
  );
};

export default Navbar;
