// Generate avatar URL from name using DiceBear API (free, no auth needed)
// Uses "initials" style for clean look, with party-colored backgrounds
export function getAvatarUrl(name: string, partyColor: string): string {
  const bg = partyColor.replace("#", "");
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=${bg}&color=fff&size=200&bold=true&font-size=0.4`;
}

// Generate a more realistic avatar using DiceBear "avataaars" style
export function getIllustrationAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1a1a2e&textColor=ffffff`;
}
