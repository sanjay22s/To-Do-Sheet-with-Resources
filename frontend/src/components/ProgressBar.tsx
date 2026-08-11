type ProgressBarProps = {
  value: number;
  tone?: 'mint' | 'amber' | 'coral';
};

export function ProgressBar({ value, tone = 'mint' }: ProgressBarProps) {
  const color = {
    mint: 'bg-mint',
    amber: 'bg-amber',
    coral: 'bg-coral',
  }[tone];

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${color} transition-all duration-300`} style={{ width: `${value}%` }} />
    </div>
  );
}
