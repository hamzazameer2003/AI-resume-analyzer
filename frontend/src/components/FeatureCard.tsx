type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: Props) {
  return (
    <div className="group rounded-2xl border border-white/60 bg-white/70 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/70">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate dark:text-slate-300">{description}</p>
      <div className="mt-4 h-1 w-12 rounded-full bg-accent opacity-0 transition group-hover:opacity-100" />
    </div>
  );
}
