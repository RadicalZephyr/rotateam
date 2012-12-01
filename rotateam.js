Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

currentGroup = '';

if (Meteor.isClient) {

    Template.nav.groups = function () {
        return Teams.find();
    };
    Template.nav.events({
        'click #add-group': function (event) {
            console.log("Clicked the add-group button");
            Session.set("modal", {"title": "Add a Group",
                                  "type": "Group"});
            console.log($('#modalAddForm').modal());
        },
        'click a': function (event) {
            console.log("Show group "+this.name);
            if (this.name) {
                currentGroup = this.name;
                console.log(currentGroup);
            }
        }
    });

    Template.addForm.title = function () {
        var modal = Session.get("modal");
        if (modal)
            return modal.title;
        else
            return '';
    };
    Template.addForm.type = function () {
        var modal = Session.get("modal");
        if (modal)
            return modal.type;
        else
            return '';
    };
    Template.addForm.events({
        'click #add-form button': function (event) {
            var groupName = $('#add-form')[0].elements["groupname"].value;
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

    Template.body.members = function() {
        return Members.find({'group': currentGroup});
    };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
