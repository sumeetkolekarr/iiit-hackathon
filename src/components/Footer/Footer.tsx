import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Heart 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer links organized by section
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Our Team", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" }
      ]
    },
    {
      title: "Products",
      links: [
        { name: "Product 1", href: "#" },
        { name: "Product 2", href: "#" },
        { name: "Product 3", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Case Studies", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Webinars", href: "#" },
        { name: "Open Source", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Contact Legal", href: "#" }
      ]
    }
  ];
  
  // Social media links
  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#", name: "Facebook" },
    { icon: <Twitter size={18} />, href: "#", name: "Twitter" },
    { icon: <Instagram size={18} />, href: "#", name: "Instagram" },
    { icon: <Linkedin size={18} />, href: "#", name: "LinkedIn" }
  ];
  
  // Contact information
  const contactInfo = [
    { icon: <MapPin size={16} />, text: "123 Innovation Street, Tech City, TC 10101" },
    { icon: <Phone size={16} />, text: "+1 (555) 123-4567" },
    { icon: <Mail size={16} />, text: "hello@horizon.com" }
  ];
  
  return (
    <footer className="bg-gray-100 text-gray-900">
      {/* Top section with newsletter */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h3 className="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
              <p className="text-white/80">
                Subscribe to our newsletter for the latest updates, features, and news.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="bg-white text-purple-600 font-medium px-4 py-3 rounded-r-lg hover:bg-gray-900 transition-colors duration-200 flex items-center">
                  Subscribe
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and company info */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg mr-2"></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Horizon</span>
            </a>
            <p className="text-gray-600 mb-4">
              Empowering innovation and digital transformation across industries with cutting-edge solutions.
            </p>
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="bg-purple-100 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-blue-100 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer link sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-black font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Contact information section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 text-gray-600 mt-1">{info.icon}</div>
                <p className="text-gray-600">{info.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom copyright section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-700 text-sm mb-4 md:mb-0">
            © {currentYear} Horizon. All rights reserved. Made with <Heart size={14} className="inline text-red-500" /> by our team.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;