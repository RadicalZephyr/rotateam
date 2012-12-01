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
                if (!err) {
                    Teams.insert({"name": value,
                                  "period": "1d",
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
    Template.addForm.events({
        'click #add ': function (event, template) {
            name = template.find("#nameInput").value;
            console.log("Entered value to add \""+name+"\"!");
            dlg = $("#modalAddForm");
            dlg.on('hide', function () {
                template.callback(false, name);
            });
            dlg.modal('hide');
        }
    });
    Template.addForm.created = function () {
        this.show = function(callback) {
            this.callback = callback;
            dlg = $("#modalAddForm");
            dlg.on('hide', function () {
                callback(true, '');
            });
            dlg.modal('show');
        };
        console.log(this);
        AddForm = this;
        console.log("Setting Session.addForm");
    };

    Template.body.members = function() {
        return Members.find({'group': Session.get("currentGroup")});
    };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
