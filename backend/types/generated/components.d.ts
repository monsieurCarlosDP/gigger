import type { Schema, Struct } from '@strapi/strapi';

export interface EventBudget extends Struct.ComponentSchema {
  collectionName: 'components_event_budgets';
  info: {
    displayName: 'Budget';
    icon: 'file';
  };
  attributes: {
    Accepted: Schema.Attribute.Boolean;
    Base: Schema.Attribute.Integer;
    Dietas: Schema.Attribute.Integer;
    DJ: Schema.Attribute.Boolean;
    Equipment: Schema.Attribute.Boolean;
  };
}

export interface EventTimelineStop extends Struct.ComponentSchema {
  collectionName: 'components_event_timeline_stops';
  info: {
    displayName: 'TimelineStop';
    icon: 'pinMap';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Label: Schema.Attribute.String;
    Time: Schema.Attribute.DateTime;
    Type: Schema.Attribute.Enumeration<
      [
        'load',
        'unload',
        'pickup',
        'setup',
        'event_start',
        'event_end',
        'arrival',
        'teardown',
        'meal',
      ]
    >;
    users_permissions_user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface UserAvatar extends Struct.ComponentSchema {
  collectionName: 'components_user_avatars';
  info: {
    displayName: 'Avatar';
    icon: 'emotionHappy';
  };
  attributes: {
    accessories: Schema.Attribute.Enumeration<
      [
        'kurt',
        'prescription01',
        'prescription02',
        'round',
        'sunglasses',
        'wayfarers',
        'eyepatch',
      ]
    >;
    accessoriesProbability: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    clothesColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'929598'>;
    clothing: Schema.Attribute.Enumeration<
      [
        'blazerAndShirt',
        'blazerAndSweater',
        'collarAndSweater',
        'graphicShirt',
        'hoodie',
        'overall',
        'shirtCrewNeck',
        'shirtScoopNeck',
        'shirtVNeck',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'blazerAndShirt'>;
    clothingGraphic: Schema.Attribute.Enumeration<
      [
        'bat',
        'bear',
        'cumbia',
        'deer',
        'diamond',
        'hola',
        'pizza',
        'resist',
        'skull',
        'skullOutline',
      ]
    >;
    eyebrows: Schema.Attribute.Enumeration<
      [
        'angryNatural',
        'defaultNatural',
        'flatNatural',
        'frownNatural',
        'raisedExcitedNatural',
        'sadConcernedNatural',
        'unibrowNatural',
        'upDownNatural',
        'angry',
        'default',
        'raisedExcited',
        'sadConcerned',
        'upDown',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
    eyes: Schema.Attribute.Enumeration<
      [
        'closed',
        'cry',
        'default',
        'eyeRoll',
        'happy',
        'hearts',
        'side',
        'squint',
        'surprised',
        'winkWacky',
        'wink',
        'xDizzy',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
    facialHair: Schema.Attribute.Enumeration<
      [
        'beardLight',
        'beardMajestic',
        'beardMedium',
        'moustacheFancy',
        'moustacheMagnum',
      ]
    >;
    facialHairColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'4a312c'>;
    facialHairProbability: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    hairColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'4a312c'>;
    hatColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'929598'>;
    mouth: Schema.Attribute.Enumeration<
      [
        'concerned',
        'default',
        'disbelief',
        'eating',
        'grimace',
        'sad',
        'screamOpen',
        'serious',
        'smile',
        'tongue',
        'twinkle',
        'vomit',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'smile'>;
    skinColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'edb98a'>;
    top: Schema.Attribute.Enumeration<
      [
        'hat',
        'hijab',
        'turban',
        'winterHat1',
        'winterHat02',
        'winterHat03',
        'winterHat04',
        'bob',
        'bun',
        'curly',
        'curvy',
        'dreads',
        'frida',
        'fro',
        'froBand',
        'longButNotTooLong',
        'miaWallace',
        'shavedSides',
        'straight02',
        'straight01',
        'straightAndStrand',
        'dreads01',
        'dreads02',
        'frizzle',
        'shaggy',
        'shaggyMullet',
        'shortCurly',
        'shortFlat',
        'shortRound',
        'shortWaved',
        'sides',
        'theCaesar',
        'theCaesarAndSidePart',
        'bigHair',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'shortFlat'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'event.budget': EventBudget;
      'event.timeline-stop': EventTimelineStop;
      'user.avatar': UserAvatar;
    }
  }
}
