export function AdminStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-surface-dark rounded-xl p-5 border border-white/5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
