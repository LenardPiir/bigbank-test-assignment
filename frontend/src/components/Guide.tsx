export default function Guide() {
  return (
    <div className="space-y-5 text-[var(--parchment)]">
      <p className="text-base leading-relaxed">
        Navigate the land of Mugloar by completing quests, trading with merchants,
        and managing your reputation.
      </p>

      <Section title="Quest Board">
        The bulletin board displays available quests. Each quest shows its
        <strong> gold reward</strong>, <strong>turns until expiry</strong>, and
        <strong> risk level</strong>. Hover the risk label for more detail.
        Click <strong>ACCEPT</strong> to attempt a quest.
      </Section>

      <Section title="Risk Levels">
        <ul className="space-y-1 mt-1.5">
          <RiskRow color="text-emerald-400" label="Safe" desc="High chance of success" />
          <RiskRow color="text-yellow-400" label="Moderate risk" desc="Roughly even odds" />
          <RiskRow color="text-orange-400" label="Dangerous" desc="More likely to fail" />
          <RiskRow color="text-red-400" label="Deadly" desc="Almost certain failure" />
        </ul>
      </Section>

      <Section title="Lives &amp; Healing">
        You start with <strong>3 lives</strong>. A failed quest costs one life.
        When lives reach zero, the adventure ends.
        Visit the <strong>Merchant</strong> to buy a <strong>Healing Potion</strong> (50 gold) and restore one life.
      </Section>

      <Section title="Merchant">
        The merchant sells potions, gear, and upgrades. Each purchase costs <strong>one turn</strong> in
        addition to gold. Spend wisely.
      </Section>

      <Section title="Reputation">
        Your actions shape how factions view you. The <strong>Reputation</strong> panel
        shows your standing with the people, the state, and the underworld.
      </Section>

      <Section title="Chronicle">
        A log of every quest attempted and item purchased. Review your
        journey in the <strong>Chronicle</strong> panel.
      </Section>

      <div className="ornate-divider my-4" />
      <p className="text-base text-[var(--parchment-dark)] italic text-center">
        Fortune favours the bold &mdash; but wisdom keeps thee alive.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--gold)] mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
        {title}
      </h3>
      <div className="text-base leading-relaxed text-[var(--parchment-dark)]">{children}</div>
    </div>
  );
}

function RiskRow({ color, label, desc }: { color: string; label: string; desc: string }) {
  return (
    <li className="text-base flex items-center gap-2">
      <span className={`font-bold ${color}`}>{label}</span>
      <span className="text-[var(--parchment-dark)]">&mdash; {desc}</span>
    </li>
  );
}
