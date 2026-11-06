import React from 'react';
import { UserProfile, RewardGift } from '../types';
import { REWARD_GIFTS } from '../data/rewardsData';
import { canPurchaseReward } from '../utils/gameLogic';
import { X, Gift, Coins, Check, Sparkles, Award } from 'lucide-react';

interface RewardStoreModalProps {
  user: UserProfile;
  onClose: () => void;
  onPurchase: (gift: RewardGift) => void;
}

export const RewardStoreModal: React.FC<RewardStoreModalProps> = ({
  user,
  onClose,
  onPurchase,
}) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');

  const filteredGifts = REWARD_GIFTS.filter(
    (g) => selectedFilter === 'all' || g.category === selectedFilter
  );

  const rarityColors: Record<string, string> = {
    common: 'text-slate-300 border-slate-700 bg-slate-800/40',
    rare: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/20',
    epic: 'text-purple-300 border-purple-500/40 bg-purple-950/20',
    legendary: 'text-amber-300 border-amber-500/40 bg-amber-950/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0b1026] border border-slate-700/80 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">
              🎁
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Cosmic Gifts, Bonuses & Rewards Vault
              </h2>
              <span className="text-xs text-slate-400">
                Redeem your earned Lambda Coins for historical space relics & badges
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Balance Banner */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400 fill-amber-400/40" />
            <span className="text-xs text-slate-300">Your Lambda Balance:</span>
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono">
            {user.coins} Coins
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          {['all', 'badge', 'equipment', 'trophy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
                selectedFilter === cat
                  ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gifts Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredGifts.map((gift) => {
            const isUnlocked = user.unlockedGifts.includes(gift.id);
            const canAfford = canPurchaseReward(user.coins, gift.costCoins);

            return (
              <div
                key={gift.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  rarityColors[gift.rarity]
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">{gift.icon}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/40 border border-current">
                      {gift.rarity}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm font-display">
                    {gift.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {gift.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>{gift.costCoins} 🪙</span>
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Collected
                    </span>
                  ) : (
                    <button
                      onClick={() => onPurchase(gift)}
                      disabled={!canAfford}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm"
                    >
                      {canAfford ? 'Unlock Reward' : 'Need More Coins'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
