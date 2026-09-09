import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import { getShopIcon } from './Icons';

const ITEM_DESCRIPTIONS: Record<string, string> = {
  'Healing potion': 'Restores 1 life',
  'Claw Sharpening': 'Improves attack ability',
  'Gasoline': 'Fuels your dragon for faster travel',
  'Copper Plating': 'Adds light armor protection',
  'Book of Tricks': 'Learn new combat techniques',
  'Potion of Stronger Wings': 'Increases flight speed and agility',
  'Claw Honing': 'Greatly improves attack power',
  'Rocket Fuel': 'Maximum dragon speed boost',
  'Iron Plating': 'Heavy armor for strong protection',
  'Book of Megatricks': 'Master advanced combat techniques',
  'Potion of Awesome Wings': 'Greatly increases flight ability',
};

function getItemDescription(name: string): string {
  return ITEM_DESCRIPTIONS[name] ?? 'A mysterious item from the merchant';
}

export default function Shop() {
  const game = useGameStore((s) => s.game);
  const shopItems = useGameStore((s) => s.shopItems);
  const buyItem = useGameStore((s) => s.buyItem);
  const loading = useGameStore((s) => s.loading);
  const [notification, setNotification] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notification) return;
    const scrollParent = topRef.current?.closest('.overflow-y-auto');
    if (scrollParent) scrollParent.scrollTop = 0;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!game) return null;

  const handleBuy = async (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    await buyItem(itemId);
    if (item) setNotification(`Acquired ${item.name}!`);
  };

  return (
    <div ref={topRef}>
      <p className="text-[var(--parchment-dark)] text-sm italic mb-3 flex items-center gap-1.5">
        <span className="text-yellow-500">&#9888;</span> Purchasing an item costs one turn
      </p>

      {notification && (
        <div className="mb-3 px-3 py-2 rounded-lg text-base font-semibold text-center"
             style={{ background: 'rgba(45, 90, 39, 0.3)', border: '1px solid rgba(74, 138, 64, 0.5)', color: '#4a9a40' }}>
          {notification}
        </div>
      )}

      {shopItems.length === 0 ? (
        <p className="text-[var(--parchment-dark)] text-base italic">The merchant has no wares.</p>
      ) : (
        <div className="space-y-2.5">
          {shopItems.map((item) => {
            const Icon = getShopIcon(item.name);
            return (
              <div key={item.id} className="rounded-lg p-3.5 flex items-center gap-3"
                   style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.15)' }}>
                <div className="w-11 h-11 shrink-0 rounded"
                     style={{ background: 'rgba(201,162,39,0.1)' }}>
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--parchment)] text-base">{item.name}</p>
                  <p className="text-sm text-[var(--gold)] opacity-80">{item.cost} gold</p>
                  <p className="text-sm text-[var(--parchment-dark)] italic">
                    {getItemDescription(item.name)}
                  </p>
                </div>
                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={loading || game.gold < item.cost}
                  className="btn-buy px-4 py-2 rounded-lg text-base cursor-pointer"
                >
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
