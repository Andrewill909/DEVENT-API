import { AbilityBuilder, Ability } from '@casl/ability';
import { UserI } from './Models/User';

export function checkPolicyFor(user: UserI | undefined) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  if (!user) {
    can('read', 'Event');
  } else if (user.role === 'user') {
    //? See event list
    can('read', 'Event');
    //? create event
    can('create', 'Event', { organizerId: user._id });
    //? can update event
    can('update', 'Event', { organizerId: user._id });
  } else if (user.role === 'admin') {
    can('manage', 'all');
  }

  return new Ability(rules);
}
