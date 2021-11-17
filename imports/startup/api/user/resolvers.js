export default {
    Query : {
        user(obj, args, { user }){
            return user || {}
        },
        users(obj, args){
            return Meteor.users.find({}).fetch() || {};
        }
    },
    User:{
        email:user => (user._id != null ? user.emails[0].address : null),
        isAdmin:user=> (user._id != null ? user.settings.isAdmin : null),
        isOwner:user=> (user._id != null ? user.settings.isOwner : null),
        activated:user=> (user._id != null ? user.settings.activated : null),
        verified:user=> (user._id != null ? user.emails[0].verified : null),
        firstname:user=> (user._id != null ? user.profile.firstname : null),
        lastname:user=> (user._id != null ? user.profile.lastname : null),
        createdAt:user=> (user._id != null ? user.createdAt : null),
        lastLogin:user=> (user._id != null && user.services.resume.loginTokens.length > 0 ? user.services.resume.loginTokens.slice(-1)[0].when : null)
    },
    Mutation:{
        editUserProfile(obj, {_id,email,firstname,lastname,age}){
            const res = Meteor.users.update(
                {
                    _id: _id
                }, {
                    $set: {
                        "emails[0].address": email,
                        "profile.firstname": firstname,
                        "profile.lastname": lastname,
                        "profile.age": age
                    }
                }
            );
            return res;
        },
        toggleAdmin(obj, {admin,_id}){
            const adminUser = Meteor.users.findOne({_id:admin});
            if(adminUser.settings.isAdmin){
                const user = Meteor.users.findOne({_id:_id});
                Meteor.users.update({
                    _id: _id
                }, {
                    $set: {
                        "settings.isAdmin": !user.settings.isAdmin,
                    }
                });
            }
            const res = Meteor.users.findOne({_id:_id});
            return res;
        },
        toggleActive(obj, {admin,_id}){
            const adminUser = Meteor.users.findOne({_id:admin});
            if(adminUser.settings.isAdmin){
                const user = Meteor.users.findOne({_id:_id});
                Meteor.users.update({
                    _id: _id
                }, {
                    $set: {
                        "settings.activated": !user.settings.activated,
                    }
                });
            }
            const res = Meteor.users.findOne({_id:_id});
            return res;
        },
        deleteAccount(obj, {admin,_id}){
            const adminUser = Meteor.users.findOne({_id:admin});
            if(adminUser.settings.isAdmin){
                const res =  Meteor.users.remove(_id);
                return Meteor.users.find({}).fetch() || {};
            }
        }
    }
}