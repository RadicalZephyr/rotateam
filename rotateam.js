Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");
AddForm = null;

if (Meteor.isClient) {

    Template.nav.groups = function () {
        return Teams.find();
    };
    Template.nav.isActive = function (group) {
        return group === Session.get("currentGroup");
    };
    Template.nav.events({
        'click #add-group': function (event) {
            event.stopImmediatePropagation();
            console.log("Clicked the add-group button");
            Session.set("modal", {"title": "Add a Group",
                                  "type": "Group"});
            AddForm.show(function(err, value) {
                if (!err && value !== undefined) {
                    Teams.insert({"name": value,
                                  "period": "1d",
                                  "window": 2,
                                  "index": 0,
                                  "members": []});
                }
            });
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
    function addName(event, template) {
        name = template.find("#nameInput").value;
        console.log("Entered value to add \""+name+"\"!");
        dlg = $("#modalAddForm");
        template.error = false;
        template.value = name;
        dlg.modal('hide');
    };
    Template.addForm.events({
        'click #add ': addName,
        'keypress': function (event, template) {
            if (event.which === 13) {
                addName(event, template);
            }
        }
    });
    Template.addForm.created = function () {
        this.callbackInit = false;
        this.error = true;
        this.value = '';
        this.show = function(callback) {
            this.callback = callback;
            this.error = true;
            this.value = '';
            this.nameInput.value = '';
            $("#modalAddForm").modal('show');;
        };
        AddForm = this;
        console.log("Setting Session.addForm");
    };
    Template.addForm.rendered = function () {
        if (!this.callbackInit) {
            this.nameInput = this.find("#nameInput");
            var target = this;
            this.callbackInit = true;
            var dlg = $("#modalAddForm");
            dlg.on('hide', function () {
                console.log("Calling callback with error: "+target.error+", value: "+target.value);
                target.callback(target.error, target.value);
            });
            dlg.on('shown', function () {
                target.nameInput.focus();
            });
        }
    }

    Template.body.selected = function () {
        return ! Session.equals("currentGroup", undefined);
    };
    Template.body.groupname = function () {
        return Session.get("currentGroup");
    };
    Template.body.members = function () {
        return Members.find({'group': Session.get("currentGroup")});
    };
    Template.body.events({
        'click a': function () {
            event.stopImmediatePropagation();
            console.log("Clicked the add-member button");
            Session.set("modal", {"title": "Add a Team Member",
                                  "type": "Member"});
            AddForm.show(function(err, value) {
                if (!err) {
                    Members.insert({"name": value,
                                    "userId": undefined,
                                    "group": Session.get("currentGroup")});
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
