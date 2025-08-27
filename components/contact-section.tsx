"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  Send,
  User,
  MessageSquare,
  Building2,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.email.includes("@")) errors.push("Valid email is required");
    if (!formData.subject.trim()) errors.push("Subject is required");
    if (!formData.message.trim()) errors.push("Message is required");
    if (formData.message.length < 10)
      errors.push("Message must be at least 10 characters");

    return errors;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For now, we'll simulate success
      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        toast({
          title: "Message Sent Successfully!",
          description:
            "Thank you for reaching out. We'll get back to you within 24 hours.",
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Send Message",
        description:
          "There was an error sending your message. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "contact@deepcheck.ai",
      description: "Get in touch with our team",
      action: () => window.open("mailto:contact@deepcheck.ai"),
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST",
      action: () => window.open("tel:+15551234567"),
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-card/50 to-background relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 md:pt-0"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-mono font-bold mb-4">
            GET IN{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TOUCH
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to secure your digital content? Let's discuss how DeepCheck
            can protect your organization.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-mono flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-mono text-foreground flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-mono text-sm"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-mono text-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-mono text-sm"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-mono text-foreground flex items-center gap-2">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-mono text-sm"
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-mono text-foreground flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-mono text-sm"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="demo">Request Demo</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="enterprise">Enterprise Solutions</option>
                      <option value="api">API Integration</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-mono text-foreground flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 font-mono resize-vertical text-sm"
                      placeholder="Tell us about your needs, questions, or how we can help..."
                      required
                    />
                    <div className="text-xs text-muted-foreground font-mono">
                      {formData.message.length}/1000 characters
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full font-mono pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        SENDING MESSAGE...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        SEND MESSAGE
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div
            className={`space-y-6 lg:space-y-8 transition-all duration-1000 delay-400 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Contact Methods */}
            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="border-border/30 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={info.action}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-mono font-semibold text-base sm:text-lg mb-1">
                          {info.title}
                        </h3>
                        <p className="text-primary font-mono font-medium mb-1 text-sm sm:text-base">
                          {info.value}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h3 className="font-mono font-semibold text-base sm:text-lg">
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monday - Friday
                    </span>
                    <span className="text-foreground">
                      9:00 AM - 6:00 PM EST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground">
                      10:00 AM - 2:00 PM EST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-mono font-semibold text-foreground text-sm sm:text-base">
                    Quick Response Guarantee
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We respond to all inquiries within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
