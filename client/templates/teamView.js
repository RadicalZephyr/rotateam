Template.teamView.selected = function () {
    return ! Session.equals("currentTeam", undefined);
};

Template.teamView.team = RotaTeam.getCurrentTeam;

Template.teamView.members = function () {
    return Members.find({'team': Session.get("currentTeam")});
};

Template.teamView.events({
    'click a': function () {
        event.stopImmediatePropagation();
        console.log("Clicked the add-member button");
        Session.set("modal", {"title": "Add a Team Member",
                              "type": "Member"});
        AddForm.show(function(err, value) {
            if (!err) {
                RotaTeam.addMember({"name": value,
                                    "team": Session.get("currentTeam")});
            }
        });
    }
});
