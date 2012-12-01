Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

if (Meteor.isClient) {

    Template.nav.groups = function () {
        return Teams.find();
    };
    Template.nav.isActive = function (group) {
        return group === Session.get("currentGroup");
    };
    Template.nav.events({
        'click #add-group': function (event) {
            console.log("Clicked the add-group button");
            Session.set("modal", {"title": "Add a Group",
                                  "type": "Group"});
            $('#modalAddForm').modal();
        },
        'click a': function (event) {
            console.log("Show group "+this.name);
            if (this.name) {
                Session.set("currentGroup", this.name);
            }
        }
    });

    Template.addForm.title = function () {
        var modal = Session.get("modal");
        if (modal) return modal.title;
        else return '';
    };
    Template.addForm.type = function () {
        var modal = Session.get("modal");
        if (modal) return modal.type;
        else return '';
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
        return Members.find({'group': Session.get("currentGroup")});
    };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
