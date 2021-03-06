Schema = {};

Schema.UserProfile = new SimpleSchema({
    firstname: {
        type: String,
        label: 'Nombre',
        optional: true
    },
    lastname: {
        type: String,
        label: 'Apellidos',
        optional: true
    },
    bio: {
        type: String,
        label: 'Bio',
        optional: true
    },
    organization : {
        type: String,
        label: 'Organización',
        optional: true
    },
    website: {
        type: String,
        label: 'Web',
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    twitter: {
        type: String,
        label: 'Twitter',
        regEx: SimpleSchema.RegEx.Url,
        optional: true,
        autoform: {
          afFieldInput: {
            type: "url"
          }
        }
    },
    facebook: {
        type: String,
        label: 'Facebook',
        regEx: SimpleSchema.RegEx.Url,
        optional: true,
        autoform: {
          afFieldInput: {
            type: "url"
          }
        }
    },
    dicts: {
        type: [String],
        label: 'Ámbitos',
        optional: true
    }
});

Schema.User = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    emails: {
        type: [Object],
        optional: true
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: [String],
        optional: true
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    }
});

Meteor.users.attachSchema(Schema.User);



Meteor.users.allow({
    update:  function(userId){
        return can.updateUser(userId);
    }
});

Meteor.methods({
    addDictToUser: function(userId, dict) {
        if (can.updateUser(userId)) {
            Meteor.users.update(userId, {$push: {'profile.dicts': dict}});
        }
    },
    removeDictToUser: function(userId, dict) {
        if (can.updateUser(userId)) {
            Meteor.users.update(userId, {$pop: {'profile.dicts': dict}});
        }
    },
    removeUser: function(userId) {
        if (can.removeUser(userId)) {
            Meteor.users.remove(userId, function (error, result) {
                if (error) {
                    console.log("Error removing user: ", error);
                } else {
                    console.log("User removed");
                    Router.go('/');
                }
            });
        }
    }
});
