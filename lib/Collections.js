Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

function getCurrentTeam () {
    return Teams.findOne({'_id': Session.get("currentTeam")});
};

function addTeam (data) {
    if ((typeof data.callback) !== "function" )
        throw "Illegal Argument: must specify a callback";

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
    Teams.insert(newTeam, data.callback);
}
