Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");

function getCurrentGroup () {
    return Teams.findOne({'_id': Session.get("currentGroup")});
};
