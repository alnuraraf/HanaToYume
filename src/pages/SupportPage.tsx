import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SupportPage: React.FC = () => {
  const navigate = useStore((s) => s.navigate);
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-nami-bg pt-20 pb-20 md:pb-12 px-4 md:px-8 max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('profile')}
        className="flex items-center gap-2 text-sm text-nami-muted hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nami-accent to-nami-accent-2 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Support NamiTube</h1>
        <p className="text-nami-muted max-w-md mx-auto">
          NamiTube is completely free and ad-free. If you enjoy the platform, consider supporting us to keep it running.
        </p>
      </motion.div>

      {/* Support options */}
      <div className="space-y-4">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 rounded-2xl bg-nami-surface border border-nami-border hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
            <Coffee className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Buy Me a Coffee</h3>
            <p className="text-sm text-nami-muted">Support with a one-time donation</p>
          </div>
          <ExternalLink className="w-4 h-4 text-nami-muted group-hover:text-yellow-400 transition-colors" />
        </motion.a>

        {/* Crypto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-nami-surface border border-nami-border p-5"
        >
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
            </svg>
            Crypto Donations
          </h3>

          <CryptoRow
            label="Bitcoin (BTC)"
            address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
            copied={copied}
            onCopy={copyToClipboard}
          />
          <CryptoRow
            label="Ethereum (ETH)"
            address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
            copied={copied}
            onCopy={copyToClipboard}
          />
        </motion.div>

        {/* Star on GitHub */}
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 rounded-2xl bg-nami-surface border border-nami-border hover:border-nami-accent/30 hover:bg-nami-accent/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Star on GitHub</h3>
            <p className="text-sm text-nami-muted">Support us by giving a star</p>
          </div>
          <ExternalLink className="w-4 h-4 text-nami-muted group-hover:text-nami-accent transition-colors" />
        </motion.a>
      </div>

      {/* Thank you */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-nami-muted mt-12"
      >
        Thank you for supporting NamiTube. Every contribution helps keep the platform running.
      </motion.p>
    </div>
  );
};

const CryptoRow: React.FC<{
  label: string;
  address: string;
  copied: string | null;
  onCopy: (text: string, label: string) => void;
}> = ({ label, address, copied, onCopy }) => (
  <div className="flex items-center justify-between py-3 border-t border-nami-border first:border-0">
    <div className="min-w-0 flex-1 mr-3">
      <p className="text-sm font-medium text-nami-text">{label}</p>
      <p className="text-xs text-nami-muted truncate font-mono">{address}</p>
    </div>
    <button
      onClick={() => onCopy(address, label)}
      className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
    >
      {copied === label ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-nami-muted" />
      )}
    </button>
  </div>
);
