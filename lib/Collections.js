Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

_.forEachProperty = function(object, iterator) {
    _.each(_.keys(object), function(key, index, list) {
        if (_.has(key)) {
            iterator(key, index, list);
        }
    }, object);
}

RotaTeam = {};

RotaTeam.getCurrentTeam = function () {
    return Teams.findOne({'_id': Session.get("currentTeam")});
};

RotaTeam.calculateNextRollover = function(team) {
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

RotaTeam.shouldRollover = function(team) {
    var now = new Date();
    return team.nextRollover <= now
};

RotaTeam.doRollover = function() {
    Teams.find().forEach(function (team) {
        if (this.shouldRollover(team)) {
            team.nextRollover = calculateNextRollover(team);
            team.index += team.rollFactor || 1;
            Teams.update(team._id, team, function (err) {
                console.log("Rollover of "+team.name+" completed with "+err);
            });
        }
    });
};

RotaTeam.addTeam = function (data, callback) {
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

    newTeam.nextRollover = this.calculateNextRollover(newTeam);
    Teams.insert(newTeam, callback);
};

RotaTeam.addMember = function(data, callback) {
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

};


/**
 * Mappings must contain two properties: teams and members.
 * Each of these objects should contain functions to specify
 * the mapping of old document properties to new ones.
 *
 * --- This isn't totally thought out at the moment.  Currently, the
 * way it works is to iterate over all documents in a collection,
 * calling functions from the mappings object that are named the same
 * as existing properties in the document, and the only argument that
 * they get passed is the document itself.  This is probably
 * unneccessarily complicated, though kind of cool.
 *
 * Instead, we could probably just iterate through all the documents,
 * calling all the function properties owned by each mapping object,
 * and passing to it the entire current document.
 *
 * Interesting idea: use the concept of data modelling transformations
 * to "build" transformations.  Some sort of parser that takes two
 * documents, or a series of document pairs.  It then analyzes the
 * differences, and produces code to transform documents from the
 * first state to the second.
 */
RotaTeam.migrateDatabase = function (mappings) {
    var runMapping = function (mapping, prop, index) {
        if ((typeof mapping[prop]) === "function")
            mapping[prop](this);
    }

    if (mappings.teams) {
        Teams.find().forEach(function (team) {
            _.forEachProperty(team, runMapping.bind(team, mappings.teams));
        });
    }

    if (mappings.members) {
        Members.find().forEach(function (member) {
            _.forEachProperty(member, runMapping.bind(undefined, mappings.members));
        });
    }
};
