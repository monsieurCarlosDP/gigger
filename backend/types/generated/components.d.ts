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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'event.budget': EventBudget;
    }
  }
}
