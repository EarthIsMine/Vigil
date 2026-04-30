import Heatmap from '@/components/Heatmap';

export default function ValidatorHeatmapSection() {
  return (
    <div className="bg-[#0a0e1a] border border-white/10 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Attack Frequency Heatmap</h2>
      <Heatmap />
    </div>
  );
}
