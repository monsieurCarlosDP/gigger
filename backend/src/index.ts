import type { Core } from '@strapi/strapi';

const avatarOptions = {
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
  skinColor: ['edb98a', 'd08b5b', 'ae5d29', '614335', 'f8d25c', 'fd9841', 'ffdbb4'],
  hairColor: ['a55728', '2c1b18', 'b58143', 'd6b370', '724133', '4a312c', 'f59797', 'ecdcbf', 'c93305', 'e8e1e1'],
  clothesColor: ['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffdeb5', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff'],
  facialHairColor: ['a55728', '2c1b18', 'b58143', 'd6b370', '724133', '4a312c'],
  hatColor: ['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'ff488e', 'ff5c5c', 'ffffff'],
} as const;

function randomAvatar() {
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
  return {
    top: pick(avatarOptions.top),
    accessories: pick(avatarOptions.accessories),
    accessoriesProbability: Math.random() > 0.7 ? 100 : 0,
    facialHair: pick(avatarOptions.facialHair),
    facialHairProbability: Math.random() > 0.7 ? 100 : 0,
    clothing: pick(avatarOptions.clothing),
    clothingGraphic: pick(avatarOptions.clothingGraphic),
    eyes: pick(avatarOptions.eyes),
    eyebrows: pick(avatarOptions.eyebrows),
    mouth: pick(avatarOptions.mouth),
    skinColor: pick(avatarOptions.skinColor),
    hairColor: pick(avatarOptions.hairColor),
    clothesColor: pick(avatarOptions.clothesColor),
    facialHairColor: pick(avatarOptions.facialHairColor),
    hatColor: pick(avatarOptions.hatColor),
  };
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Lifecycle: assign random avatar to new users
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeCreate(event) {
        if (!event.params.data.avatar) {
          event.params.data.avatar = randomAvatar();
        }
      },
    });

    // Migration: fix users with missing/invalid avatars
    const users = await strapi.documents('plugin::users-permissions.user').findMany({
      populate: ['avatar'],
    });
    for (const user of users) {
      const avatar = user.avatar;
      const needsFix = !avatar || !avatar.top || !avatar.clothing || !avatar.eyes;
      if (needsFix) {
        await strapi.documents('plugin::users-permissions.user').update({
          documentId: user.documentId,
          data: { avatar: randomAvatar() },
        });
        strapi.log.info(`Migrated avatar for user "${user.username}" (id: ${user.id})`);
      }
    }
  },
};
