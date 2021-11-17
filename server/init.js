import '../imports/startup/server';
import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';
import Economy from '../imports/startup/api/economy/economy';

Accounts.onCreateUser(function(options, user) {

    user.profile = options.profile || {};
    user.profile.firstname = options.profile.firstname;
    user.profile.lastname = options.profile.lastname;

    user.settings = options.settings || {};

    if(Meteor.users.find().count() == 0){
        user.settings.isOwner = true;
        user.settings.isAdmin = true;
        user.settings.activated = true;
    }else{
        user.settings.isOwner = options.settings.isAdmin;
        user.settings.isAdmin = options.settings.isOwner;
        user.settings.activated = false;
    }
    
    Economy.insert({
        user: user._id,
        currencies: [{
            name: "iron",
            stored: 0,
            lastUpdate: new Date(),
            color:"#fab1a0",
            max:20000,
            produceMinute: 20,
            level: 1,
            cost:{
                iron:200,
                steel:160,
                carbon:0,
                cristal:0
            }
        },{
            name: "steel",
            stored: 0,
            lastUpdate: new Date(),
            color:"#c7ecee",
            max:20000,
            produceMinute: 15,
            level: 1,
            cost:{
                iron:180,
                steel:0,
                carbon:150,
                cristal:0
            }
        },{
            name: "carbon",
            stored: 0,
            lastUpdate: new Date(),
            color:"#60a3bc",
            max:20000,
            produceMinute: 15,
            level: 1,
            cost:{
                iron:190,
                steel:190,
                carbon:0,
                cristal:0
            }
        },{
            name: "cristal",
            stored: 0,
            lastUpdate: new Date(),
            color:"#d63031",
            max:20000,
            produceMinute: 8,
            level: 1,
            cost:{
                iron:0,
                steel:180,
                carbon:180,
                cristal:0
            }
        }]
    })
    
    return user;
 });