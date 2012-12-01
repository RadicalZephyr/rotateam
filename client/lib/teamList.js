Template.teamList.groups = function () {
    return Teams.find();
};

Template.teamList.isActive = function (group) {
    return group === Session.get("currentGroup");
};

Template.teamList.events({
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
                Session.set("currentGroup", value);
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
