Template.teamList.groups = function () {
    return Teams.find();
};

Template.teamList.isActive = function (group) {
    return Session.equals("currentGroup", group);
};

Template.teamList.events({
    'click #add-group': function (event) {
        event.stopImmediatePropagation();
        console.log("Clicked the add-group button");
        Session.set("modal", {"title": "Add a Group",
                              "type": "Group"});
        AddForm.show(function(err, value) {
            if (!err && value !== undefined) {
                addTeam({"name": value,
                          "callback": function (err, result) {
                              console.log("Insert callback, err: \""+err+"\", result: \""+result+"\"");
                              if (!err)
                                  Session.set("currentGroup", result);
                          }
                         });
            }
        });
    },
    'click a': function (event) {
        console.log("Show group "+this.name);
        if (this._id) {
            Session.set("currentGroup", this._id);
        }
    }
});
