import { studentBaseLook } from '@/data/cosmetics';
import type { AvatarPalette, Cosmetic, CosmeticCategory } from '@/types/game';

const findItem = (catalog: Cosmetic[], id: string) => catalog.find((item) => item.id === id);

/** Monta a paleta do personagem a partir dos itens equipados (e de um item sendo experimentado). */
export function buildAvatar(
  equipped: Record<CosmeticCategory, string>,
  catalog: Cosmetic[],
  tryOn?: Cosmetic,
): AvatarPalette {
  const itemIds = { ...equipped, ...(tryOn ? { [tryOn.category]: tryOn.id } : {}) };
  const looks = Object.entries(itemIds).map(([category, id]) =>
    tryOn && category === tryOn.category ? tryOn.look : (findItem(catalog, id)?.look ?? {}),
  );

  return Object.assign(
    {
      background: ['#3B2F66', '#6D28D9'],
      border: '#8B5CF6',
      hat: '#8B5CF6',
      hatShade: '#5B21B6',
      star: '#FACC15',
      robe: '#22D3EE',
      robeShade: '#0E7490',
      belt: '#FACC15',
      ...studentBaseLook,
    } satisfies AvatarPalette,
    ...looks,
  );
}

/** Cor do brilho da pré-visualização, definida pelo fundo equipado/experimentado. */
export function avatarGlow(equipped: Record<CosmeticCategory, string>, catalog: Cosmetic[], tryOn?: Cosmetic) {
  if (tryOn?.category === 'fundos') return tryOn.glow ?? '#8B5CF6';
  return findItem(catalog, equipped.fundos)?.glow ?? '#8B5CF6';
}

export type CosmeticStatus = 'equipped' | 'owned' | 'locked' | 'forSale';

export function cosmeticStatus(
  item: Cosmetic,
  owned: string[],
  equipped: Record<CosmeticCategory, string>,
  level: number,
): CosmeticStatus {
  if (equipped[item.category] === item.id) return 'equipped';
  if (owned.includes(item.id)) return 'owned';
  if (item.requiredLevel && level < item.requiredLevel) return 'locked';
  return 'forSale';
}
