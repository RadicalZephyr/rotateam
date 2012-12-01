Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");


if (Meteor.isClient) {

    Template.nav.groups = function () {
        return Teams.find();
    };
    Template.nav.events({
        'click #add-group': function (event) {
            console.log("Clicked the add-group button");
        },
        'click a': function (event) {
            console.log("Show group "+this.name);
        }
    });

    Template.addGroup.events({
        'click #add-group-form button': function (event) {
            var groupName = $('#add-group-form')[0].elements["groupname"].value;
            console.log("Added a group "+groupName+"!");
            Teams.insert({'name': groupName,
                          'index': 0,
                          'members': [],
                          'period': ""},
                         function (err, id) {
                             if (err) {
                                 console.warn("Unable to create group with name: "+groupName);
                             }
                         });
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
