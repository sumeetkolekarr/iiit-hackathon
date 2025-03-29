import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Search, Bell, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    {
      name: "Products",
      href: "#",
      dropdown: [
        { name: "Product 1", href: "#" },
        { name: "Product 2", href: "#" },
        { name: "Product 3", href: "#" },
      ],
    },
    { name: "Pricing", href: "#" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu animation variants
  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg mr-2"></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Horizon
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium flex items-center transition-colors duration-200"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown
                      size={16}
                      className="ml-1 transition-transform group-hover:rotate-180"
                    />
                  )}
                </a>

                {item.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    {item.dropdown.map((dropdownItem, dropdownIndex) => (
                      <a
                        key={dropdownIndex}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Icons Section */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              title="Search"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </span>
            </button>
            <button
              type="button"
              title="User Collection"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <User size={20} />
            </button>
            <button
              type="button"
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 h-screen"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href}
                    className="text-gray-700 hover:bg-gray-100 block px-3 py-4 rounded-md text-base font-medium border-b border-gray-100 flex justify-between items-center"
                    onClick={() => !item.dropdown && setIsOpen(false)}
                  >
                    {item.name}
                    {item.dropdown && <ChevronDown size={16} />}
                  </a>

                  {item.dropdown && (
                    <div className="pl-4">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <a
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 border-b border-gray-100"
                          onClick={() => setIsOpen(false)}
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center space-x-4">
                    <button
                      title="Search"
                      type="button"
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      <Search size={20} />
                    </button>
                    <button
                      type="button"
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 relative"
                    >
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        3
                      </span>
                    </button>
                    <button
                      title="User Collection"
                      type="button"
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      <User size={20} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
