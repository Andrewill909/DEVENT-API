"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPolicyFor = void 0;
const ability_1 = require("@casl/ability");
function checkPolicyFor(user) {
    const { can, cannot, rules } = new ability_1.AbilityBuilder(ability_1.Ability);
    if (!user) {
        can('read', 'Event');
    }
    else if (user.role === 'user') {
        //? See event list
        can('read', 'Event');
        //? create event
        can('create', 'Event', { organizerId: user._id });
        //? can update event
        can('update', 'Event', { organizerId: user._id });
    }
    else if (user.role === 'admin') {
        can('manage', 'all');
    }
    return new ability_1.Ability(rules);
}
exports.checkPolicyFor = checkPolicyFor;
