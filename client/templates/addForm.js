Template.addForm.title = function () {
    var modal = Session.get("modal");
    if (modal) return modal.title;
    else return '';
};

Template.addForm.type = function () {
    var modal = Session.get("modal");
    if (modal) return modal.type;
    else return '';
};

function addName(event, template) {
    name = template.find("#nameInput").value;
    console.log("Entered value to add \""+name+"\"!");
    dlg = $("#modalAddForm");
    template.error = false;
    template.value = name;
    dlg.modal('hide');
};

Template.addForm.events({
    'click #add ': addName,
    'keypress': function (event, template) {
        if (event.which === 13) {
            addName(event, template);
        }
    }
});

Template.addForm.created = function () {
    this.callbackInit = false;
    this.error = true;
    this.value = '';
    this.show = function(callback) {
        this.callback = callback;
        this.error = true;
        this.value = '';
        this.nameInput.value = '';
        $("#modalAddForm").modal('show');;
    };
    AddForm = this;
    console.log("Setting Session.addForm");
};

Template.addForm.rendered = function () {
    if (!this.callbackInit) {
        this.nameInput = this.find("#nameInput");
        var target = this;
        this.callbackInit = true;
        var dlg = $("#modalAddForm");
        dlg.on('hidden', function () {
            console.log("Calling callback with error: "+target.error+", value: "+target.value);
            target.callback(target.error, target.value);
        });
        dlg.on('shown', function () {
            target.nameInput.focus();
        });
    }
}
