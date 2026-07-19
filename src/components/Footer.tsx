export function Footer() {
  return (
    <footer className="mt-auto border-t border-sense-border bg-sense-surface/50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
          Família Sense
        </p>

        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <FooterLink icon="🏠" label="Classic" active />
          <FooterLink icon="👤" label="Silhueta" soon />
          <FooterLink icon="💬" label="Frase" soon />
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-xs text-gray-500">
          <p>Um jogo diário para descobrir quem é quem na família.</p>
          <p className="text-gray-600">
            familiasense — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  icon,
  label,
  active,
  soon,
}: {
  icon: string;
  label: string;
  active?: boolean;
  soon?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold ${
        active
          ? 'border-sense-orange/50 bg-sense-orange/10 text-sense-orange-light'
          : 'border-sense-border text-gray-500 opacity-60'
      }`}
    >
      <span>{icon}</span>
      {label}
      {soon && (
        <span className="rounded bg-sense-border px-1 py-0.5 text-[9px] uppercase">Em breve</span>
      )}
    </div>
  );
}
