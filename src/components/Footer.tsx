import React from 'react';
import { FacebookIcon, TwitterIcon, GithubIcon, DiscordIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08080d] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="./images/logo.png"
            alt="NamiTube"
            className="h-14 w-auto object-contain mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="hidden items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">NamiTube</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-8">
          NamiTube is a free anime streaming platform powered by public APIs.
          Watch your favorite anime anytime, anywhere.
          Discover trending series, keep track of your watchlist, and enjoy seamless streaming.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-5 mb-10">
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200" aria-label="Facebook">
            <FacebookIcon size={22} />
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200" aria-label="Twitter">
            <TwitterIcon size={22} />
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200" aria-label="GitHub">
            <GithubIcon size={22} />
          </a>
          <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors duration-200" aria-label="Discord">
            <DiscordIcon size={22} />
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-600 text-xs leading-relaxed max-w-md mb-6">
          This site does not store any files on its server. All contents are provided by non-affiliated third parties.
        </p>

        {/* Copyright */}
        <p className="text-gray-600 text-xs">
          &copy; 2026 NamiTube. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
