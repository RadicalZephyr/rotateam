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
