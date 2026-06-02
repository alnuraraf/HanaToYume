import React from 'react';
import { HeartIcon, StarIcon, DonateIcon } from '../components/Icons';

const tiers = [
  {
    name: 'Supporter',
    price: '$5',
    period: 'one-time',
    features: [
      'Support server costs',
      'Ad-free experience badge',
      'Supporter badge on profile',
    ],
    color: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/20',
  },
  {
    name: 'Premium',
    price: '$15',
    period: 'one-time',
    features: [
      'Everything in Supporter',
      'Priority streaming queue',
      'Early access to features',
      'Premium profile badge',
    ],
    color: 'from-indigo-500 to-purple-500',
    shadowColor: 'shadow-indigo-500/20',
    popular: true,
  },
  {
    name: 'Champion',
    price: '$50',
    period: 'one-time',
    features: [
      'Everything in Premium',
      'Name in credits',
      'Custom profile theme',
      'Discord VIP role',
      'Direct developer access',
    ],
    color: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/20',
  },
];

const SupportPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <HeartIcon size={36} className="text-white" filled />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Support NamiTube</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            NamiTube is a free, open-source anime streaming platform.
            Your support helps us keep the servers running and improve the experience for everyone.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:scale-[1.02] ${
                tier.popular
                  ? 'bg-gradient-to-b from-indigo-500/10 to-transparent border-indigo-500/30 shadow-xl ' + tier.shadowColor
                  : 'bg-white/3 border-white/5 hover:border-white/10'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-5`}>
                <DonateIcon size={24} className="text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-gray-500">{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 shrink-0">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  tier.popular
                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                Support Now
              </button>
            </div>
          ))}
        </div>

        {/* Why Support */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Support Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg>,
                title: 'Server Costs',
                desc: 'Keep the platform running smoothly for all users.'
              },
              {
                icon: <StarIcon size={24} className="text-yellow-400" />,
                title: 'New Features',
                desc: 'Fund development of new features and improvements.'
              },
              {
                icon: <HeartIcon size={24} className="text-red-400" />,
                title: 'Community',
                desc: 'Help build a great anime community for everyone.'
              },
            ].map(item => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-white/3 border border-white/5">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center mt-16 py-12 rounded-3xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5 border border-white/5">
          <p className="text-lg text-gray-300 max-w-lg mx-auto">
            Every contribution, no matter how small, makes a huge difference.
            Thank you for keeping NamiTube alive and free for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
