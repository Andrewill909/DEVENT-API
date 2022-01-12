"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPolicyFor = void 0;
const ability_1 = require("@casl/ability");
<<<<<<< HEAD
=======
const User_1 = require("./Models/User");
>>>>>>> main
function checkPolicyFor(user) {
    const { can, cannot, rules } = new ability_1.AbilityBuilder(ability_1.Ability);
    if (!user) {
        can('read', 'Event');
    }
<<<<<<< HEAD
    else if (user.role === 'user') {
=======
    else if (user.role === User_1.Role.user) {
>>>>>>> main
        //? See event list
        can('read', 'Event');
        //? create event
        can('create', 'Event', { organizerId: user._id });
        //? can update event
        can('update', 'Event', { organizerId: user._id });
    }
<<<<<<< HEAD
    else if (user.role === 'admin') {
=======
    else if (user.role === User_1.Role.admin) {
>>>>>>> main
        can('manage', 'all');
    }
    return new ability_1.Ability(rules);
}
exports.checkPolicyFor = checkPolicyFor;
