import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Layers, AlertCircle, Compass } from "lucide-react";
import { Button, Badge } from "../components/ui";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      {/* Header Navigation */}
      <Navbar />

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
        {/* Background Subtle Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl w-full text-center space-y-8 relative z-10"
        >
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="primary" size="md" icon={<AlertCircle className="w-4 h-4 text-primary" />}>
              Error 404
            </Badge>
          </div>

          {/* Large Animated 404 Number */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-black text-navy tracking-tight select-none opacity-90">
              4<span className="text-primary">0</span>4
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>

          {/* Heading & Explanation */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
              We couldn't find the page you were looking for. The link may be broken, or the page may have been moved.
            </p>
          </div>

          {/* Action Buttons (Back Buttons & Quick Links) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={handleGoBack}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>

            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Back to Home
              </Button>
            </Link>

            <Link to="/home" className="w-full sm:w-auto">
              <Button
                variant="navy"
                size="lg"
                leftIcon={<Layers className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Browse Projects
              </Button>
            </Link>
          </div>

          {/* Helpful Navigation Assistance */}
          <div className="pt-6 border-t border-border/60 text-xs text-text-muted flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 text-text-muted" />
            <span>Need help? Navigate using the top menu or return to home.</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotFoundPage;
