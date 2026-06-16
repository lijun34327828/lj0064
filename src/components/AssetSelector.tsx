import { Building2, TrendingUp, Briefcase, Gem, Check } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import type { AssetCategory, AssetItem } from '@/types';

const categoryIcons: Record<AssetCategory, React.ReactNode> = {
  real_estate: <Building2 size={28} />,
  fund: <TrendingUp size={28} />,
  private_enterprise: <Briefcase size={28} />,
  collection: <Gem size={28} />,
};

export default function AssetSelector() {
  const { assets, toggleAsset } = useAssetStore();

  return (
    <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-1">
      <h3 className="text-xl font-display font-semibold text-white mb-6">选择资产类目</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset: AssetItem) => (
          <button
            key={asset.category}
            onClick={() => toggleAsset(asset.category)}
            className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
              asset.selected
                ? 'border-gold/60 bg-gold/5 shadow-gold-sm'
                : 'border-white/10 bg-white/5 hover:border-gold/30 hover:bg-white/10'
            }`}
          >
            {asset.selected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                <Check size={14} className="text-navy" />
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                asset.selected ? 'bg-gold/20 text-gold' : 'bg-white/5 text-slate-400'
              }`}
            >
              {categoryIcons[asset.category]}
            </div>
            <h4
              className={`font-semibold text-lg mb-1 ${
                asset.selected ? 'text-gold' : 'text-white'
              }`}
            >
              {asset.name}
            </h4>
            <p className="text-slate-400 text-sm">
              估值 {asset.value} 万
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
