export const AVATAR_OPTIONS = {
  top: [
    'hat', 'hijab', 'turban', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04',
    'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro', 'froBand',
    'longButNotTooLong', 'miaWallace', 'shavedSides', 'straight02', 'straight01',
    'straightAndStrand', 'dreads01', 'dreads02', 'frizzle', 'shaggy', 'shaggyMullet',
    'shortCurly', 'shortFlat', 'shortRound', 'shortWaved', 'sides',
    'theCaesar', 'theCaesarAndSidePart', 'bigHair',
  ],
  accessories: [
    'kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers', 'eyepatch',
  ],
  facialHair: [
    'beardLight', 'beardMajestic', 'beardMedium', 'moustacheFancy', 'moustacheMagnum',
  ],
  clothing: [
    'blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt',
    'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck',
  ],
  clothingGraphic: [
    'bat', 'bear', 'cumbia', 'deer', 'diamond', 'hola', 'pizza', 'resist', 'skull', 'skullOutline',
  ],
  eyes: [
    'closed', 'cry', 'default', 'eyeRoll', 'happy', 'hearts', 'side',
    'squint', 'surprised', 'winkWacky', 'wink', 'xDizzy',
  ],
  eyebrows: [
    'angryNatural', 'defaultNatural', 'flatNatural', 'frownNatural',
    'raisedExcitedNatural', 'sadConcernedNatural', 'unibrowNatural',
    'upDownNatural', 'angry', 'default', 'raisedExcited', 'sadConcerned', 'upDown',
  ],
  mouth: [
    'concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad',
    'screamOpen', 'serious', 'smile', 'tongue', 'twinkle', 'vomit',
  ],
  skinColor: [
    { label: 'Claro', value: 'ffdbb4' },
    { label: 'Medio claro', value: 'edb98a' },
    { label: 'Medio', value: 'd08b5b' },
    { label: 'Bronceado', value: 'fd9841' },
    { label: 'Oscuro', value: 'ae5d29' },
    { label: 'Muy oscuro', value: '614335' },
    { label: 'Amarillo', value: 'f8d25c' },
  ],
  hairColor: [
    { label: 'Castaño', value: 'a55728' },
    { label: 'Negro', value: '2c1b18' },
    { label: 'Rubio', value: 'b58143' },
    { label: 'Rubio dorado', value: 'd6b370' },
    { label: 'Marrón', value: '724133' },
    { label: 'Marrón oscuro', value: '4a312c' },
    { label: 'Rosa pastel', value: 'f59797' },
    { label: 'Platino', value: 'ecdcbf' },
    { label: 'Pelirrojo', value: 'c93305' },
    { label: 'Gris plata', value: 'e8e1e1' },
  ],
  facialHairColor: [
    { label: 'Castaño', value: 'a55728' },
    { label: 'Negro', value: '2c1b18' },
    { label: 'Rubio', value: 'b58143' },
    { label: 'Rubio dorado', value: 'd6b370' },
    { label: 'Marrón', value: '724133' },
    { label: 'Marrón oscuro', value: '4a312c' },
    { label: 'Pelirrojo', value: 'c93305' },
  ],
  hatColor: [
    { label: 'Negro', value: '262e33' },
    { label: 'Azul', value: '65c9ff' },
    { label: 'Gris', value: '929598' },
    { label: 'Rosa pastel', value: 'ffafb9' },
    { label: 'Rojo', value: 'ff5c5c' },
    { label: 'Blanco', value: 'ffffff' },
  ],
  clothesColor: [
    { label: 'Negro', value: '262e33' },
    { label: 'Azul claro', value: '65c9ff' },
    { label: 'Azul', value: '5199e4' },
    { label: 'Azul oscuro', value: '25557c' },
    { label: 'Gris claro', value: 'e6e6e6' },
    { label: 'Gris', value: '929598' },
    { label: 'Gris oscuro', value: '3c4f5c' },
    { label: 'Azul pastel', value: 'b1e2ff' },
    { label: 'Verde pastel', value: 'a7ffc4' },
    { label: 'Naranja pastel', value: 'ffdeb5' },
    { label: 'Rosa pastel', value: 'ffafb9' },
    { label: 'Amarillo pastel', value: 'ffffb1' },
    { label: 'Rosa', value: 'ff488e' },
    { label: 'Rojo', value: 'ff5c5c' },
    { label: 'Blanco', value: 'ffffff' },
  ],
} as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickColor(arr: readonly { label: string; value: string }[]): string {
  return pick(arr).value;
}

export function randomAvatar() {
  return {
    top: pick(AVATAR_OPTIONS.top),
    accessories: Math.random() > 0.7 ? pick(AVATAR_OPTIONS.accessories) : undefined,
    accessoriesProbability: 100,
    facialHair: Math.random() > 0.6 ? pick(AVATAR_OPTIONS.facialHair) : undefined,
    facialHairProbability: 100,
    clothing: pick(AVATAR_OPTIONS.clothing),
    clothingGraphic: pick(AVATAR_OPTIONS.clothingGraphic),
    eyes: pick(AVATAR_OPTIONS.eyes),
    eyebrows: pick(AVATAR_OPTIONS.eyebrows),
    mouth: pick(AVATAR_OPTIONS.mouth),
    skinColor: pickColor(AVATAR_OPTIONS.skinColor),
    hairColor: pickColor(AVATAR_OPTIONS.hairColor),
    facialHairColor: pickColor(AVATAR_OPTIONS.facialHairColor),
    hatColor: pickColor(AVATAR_OPTIONS.hatColor),
    clothesColor: pickColor(AVATAR_OPTIONS.clothesColor),
  };
}
