module("Slide effect")

test('Should work', function() {

    var ct = Ember.AnimatedContainerView.create({
        name: 'foo',
        view: Ember.View.create({
            template: function() {
                return "Slide, and jump!";
            }
        })
    });

    Ember.run(function() {
        ct.appendTo('#qunit-fixture');
    });

    var view = 

    Ember.run(function() {
        ct.set('currentView', view);
    });

    equal(Ember.$.trim(ct.$().text()), "Slide, and jump!");

    Ember.run(function(){
        ct.destroy();
    });

});