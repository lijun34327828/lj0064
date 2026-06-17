import { useAssetStore } from '@/store/useAssetStore';
import type { AssetItem } from '@/types';

function sanitizeNumberInput(input: string, fallback: number = 0): number {
  if (input === '' || input === null || input === undefined) {
    return fallback;
  }
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) {
    return fallback;
  }
  return num;
}

interface InputFieldProps {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}

function InputField({ label, value, suffix, onChange }: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeNumberInput(rawValue, value);
    onChange(sanitizedValue);
  };

  return (
    <div>
      <label className="block text-sm text-slate-400 mb-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={isFinite(value) ? value : ''}
          onChange={handleChange}
          className="input-field pr-12"
          step="any"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export default function AssetConfigPanel() {
  const { updateAssetValue, getSelectedAssets } = useAssetStore();
  const selectedAssets = getSelectedAssets();

  if (selectedAssets.length === 0) {
    return (
      <div className="glass-card p-8 animate-fade-in-up opacity-0 animate-stagger-2 text-center">
        <h3 className="text-xl font-display font-semibold text-white mb-4">资产参数配置</h3>
        <p className="text-slate-400">请先选择资产类目</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-2">
      <h3 className="text-xl font-display font-semibold text-white mb-6">资产参数配置</h3>
      <div className="space-y-6">
        {selectedAssets.map((asset: AssetItem) => (
          <div key={asset.category} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-semibold text-gold mb-4">{asset.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="资产估值"
                value={asset.value}
                suffix="万元"
                onChange={(v) => updateAssetValue(asset.category, 'value', v)}
              />
              <InputField
                label="预期年化收益率"
                value={asset.expectedReturn}
                suffix="%"
                onChange={(v) => updateAssetValue(asset.category, 'expectedReturn', v)}
              />
              <InputField
                label="月固定收入"
                value={asset.monthlyIncome}
                suffix="元"
                onChange={(v) => updateAssetValue(asset.category, 'monthlyIncome', v)}
              />
              <InputField
                label="月固定支出"
                value={asset.monthlyExpense}
                suffix="元"
                onChange={(v) => updateAssetValue(asset.category, 'monthlyExpense', v)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
