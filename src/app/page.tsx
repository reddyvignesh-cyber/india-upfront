"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import ShareButton from "@/components/shared/ShareButton";
import CategoryTabs from "@/components/tabs/CategoryTabs";
import TabContent from "@/components/tabs/TabContent";
import { TabId } from "@/types/categories";
import { getAllCategoryData } from "@/data/registry";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("politicians");
  const categoryData = getAllCategoryData();

  return (
    <div className="relative">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center py-20">
          {/* Breaking badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 mb-8"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full live-pulse" />
            <span className="text-xs sm:text-sm font-medium text-red-400 tracking-wide">
              DATA FROM ADR / MYNETA.INFO — ELECTION COMMISSION AFFIDAVITS
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.9]"
          >
            <span className="text-white">INDIA</span>
            <br />
            <span className="text-gradient">UPFRONT</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            The truth about your elected representatives.
            <br className="hidden sm:block" />
            Criminal records. Infrastructure failures. Health crises. Exposed.
          </motion.p>

          {/* Viral stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-red-500/20 bg-black/50 backdrop-blur-sm mb-12 glow-border"
          >
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <div className="text-left">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter
                  end={40}
                  suffix="%"
                  className="text-4xl sm:text-5xl font-black text-red-500"
                />
                <span className="text-lg text-gray-400">of politicians</span>
              </div>
              <p className="text-sm text-gray-500">have declared criminal cases against them</p>
            </div>
          </motion.div>

          {/* Quick action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#explore"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-red-500/25"
            >
              Explore the Data
            </motion.a>
            <ShareButton />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-3 bg-red-500 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORY TABS ===== */}
      <div id="explore">
        <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ===== TAB CONTENT ===== */}
      <TabContent activeTab={activeTab} categoryData={categoryData} />

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/5 via-black to-orange-500/5 p-8 sm:p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(220,38,38,0.1)_0%,_transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Democracy Deserves <span className="text-gradient">Transparency</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
                Share this data with fellow citizens. The right to know is the first step
                toward accountability. Every share makes democracy stronger.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <ShareButton />
                <a
                  href="https://myneta.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm hover:text-white hover:border-gray-500 transition-colors"
                >
                  View Source Data (MyNeta)
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
