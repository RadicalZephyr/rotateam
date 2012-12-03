Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

function getCurrentTeam () {
    return Teams.findOne({'_id': Session.get("currentTeam")});
};

function calculateNextRollover(team) {
    var magnitude = parseInt(team.period);
    var unit = team.period.substr(magnitude.toString().length);
    magnitude = Math.abs(magnitude);

    var now = new Date();
    var day   = now.getUTCDate(),
        month = now.getUTCMonth(),
        year  = now.getUTCFullYear();

    switch (unit) {
    case "d":
        day += magnitude;
        break;
    case "w":
        day += magnitude * 7;
        break;
    case "m":
        month += magnitude;
        break;
    case "y":
        year += magnitude;
        break;
    }

    return new Date(year, month, day, 0, 0, 0);
};

function shouldRollover(team) {
    var now = new Date();
    return team.nextRollover <= now
}

function doRollover() {
    Teams.find().forEach(function (team) {
        if (shouldRollover(team)) {
            team.nextRollover = calculateNextRollover(team);
            team.index += team.rollFactor || 1;
            Teams.update(team._id, team, function (err) {
                console.log("Rollover of "+team.name+" completed with "+err);
            });
        }
    }
}

function addTeam (data, callback) {
    var properties = ["name",
                      "rollFactor",
                      "period",
                      "window"];
    var newTeam = {"name": "",
                   "nextRollover": new Date(),
                   "period": "1d",
                   "window": 2,
                   "index": 0,
                   "rollFactor": 1,
                   "members": []};

    _.each(properties, function (element, index, list) {
        if (data[element] !== undefined)
            newTeam[element] = data[element];
    });

    newTeam.nextRollover = calculateNextRollover(newTeam);
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
