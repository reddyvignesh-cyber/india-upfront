"use client";

import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-red-500/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className="text-lg font-black text-white">
                INDIA<span className="text-red-500">UPFRONT</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering citizens with transparent data about their elected
              representatives. Every democracy deserves accountability.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Data Sources
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="https://myneta.info" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                  MyNeta.info (ADR)
                </a>
              </li>
              <li>
                <a href="https://adrindia.org" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                  Association for Democratic Reforms
                </a>
              </li>
              <li>
                <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                  Election Commission of India
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Disclaimer
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              All data is sourced from publicly available election affidavits
              filed with the Election Commission of India. This is a
              non-commercial, public interest project.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600">
            Built for transparency. Data from ADR/MyNeta. For non-commercial use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
