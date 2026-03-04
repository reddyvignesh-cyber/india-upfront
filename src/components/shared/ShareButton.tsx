"use client";

import { Share2, Twitter, Facebook, Link2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = "Did you know 40% of Indian politicians have criminal cases? Check out IndiaUpfront - the truth about your leaders.";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = [
    {
      name: "Twitter / X",
      icon: Twitter,
      color: "hover:bg-blue-500/20 hover:text-blue-400",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-600/20 hover:text-blue-500",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      },
    },
    {
      name: "Copy Link",
      icon: Link2,
      color: "hover:bg-green-500/20 hover:text-green-400",
      onClick: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share This
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-2 min-w-[180px] z-50"
          >
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  link.onClick();
                  if (link.name !== "Copy Link") setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 transition-colors ${link.color}`}
              >
                <link.icon className="w-4 h-4" />
                {link.name === "Copy Link" && copied ? "Copied!" : link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
