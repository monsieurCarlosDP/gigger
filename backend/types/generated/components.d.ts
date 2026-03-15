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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'event.budget': EventBudget;
      'event.timeline-stop': EventTimelineStop;
    }
  }
}
