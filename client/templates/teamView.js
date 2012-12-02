Template.teamView.selected = function () {
    return ! Session.equals("currentGroup", undefined);
};

Template.teamView.group = getCurrentGroup;

Template.teamView.members = function () {
    return Members.find({'team': Session.get("currentGroup")});
};

Template.teamView.events({
    'click a': function () {
        event.stopImmediatePropagation();
        console.log("Clicked the add-member button");
        Session.set("modal", {"title": "Add a Team Member",
                              "type": "Member"});
        AddForm.show(function(err, value) {
            if (!err) {
                Members.insert({"name": value,
                                "userId": undefined,
                                "team": Session.get("currentGroup")});
            }
        });
    }
});
