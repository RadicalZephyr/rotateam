Template.teamList.teams = function () {
    return Teams.find();
};

Template.teamList.isActive = function (team) {
    return Session.equals("currentTeam", team);
};

Template.teamList.events({
    'click #add-team': function (event) {
        event.stopImmediatePropagation();
        console.log("Clicked the add-team button");
        Session.set("modal", {"title": "Add a Team",
                              "type": "Team"});
        AddForm.show(function(err, value) {
            if (!err && value !== undefined) {
                RotaTeam.addTeam({"name": value},
                                 function (err, result) {
                                     console.log("Insert callback, err: \""
                                                 +err+"\", result: \""+result+"\"");
                                     if (!err)
                                         Session.set("currentTeam", result);
                                 });
            }
        });
    },
    'click a': function (event) {
        console.log("Show team "+this.name);
        if (this._id) {
            Session.set("currentTeam", this._id);
        }
    }
});
