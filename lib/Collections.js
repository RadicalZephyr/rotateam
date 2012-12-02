Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

function getCurrentTeam () {
    return Teams.findOne({'_id': Session.get("currentTeam")});
};

function addTeam (data, callback) {
    var properties = ["name",
                      "period",
                      "window",
                      "index",
                      "members"];
    var newTeam = {"name": "",
                   "period": "1d",
                   "window": 2,
                   "index": 0,
                   "members": []};

    _.each(properties, function (element, index, list) {
        if (data[element] !== undefined)
            newTeam[element] = data[element];
    });
    Teams.insert(newTeam, callback);
}

function addMember(data, callback) {
    if (typeof data.team === undefined)
        throw "Illegal Argument: must specify a team";
    var properties = ["name",
                      "team",
                      "userId"];
    var newMember = {"name": "",
                     "team": "",
                     "userId": ""};
    _.each(properties, function (element, index, list) {
        if (data[element] !== undefined)
            newMember[element] = data[element];
    });
    Members.insert(newMember, function (err, id) {
        if ((typeof callback) === "function" )
            callback(err, id);
        if (!err) {
            Teams.update(data.team, {$push: {members: id}})
        }
    });

}
