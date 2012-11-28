Teams = new Meteor.Collection("teams");
Members = new Meteor.Collection("members");


if (Meteor.isClient) {

    Template.nav.groups = function () {
        return Teams.find();
    };
    Template.nav.events({
        'click #add-group': function () {
            console.log("Clicked the add-group button");
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
