var ct;

module('AnimatedContainerView', {
    teardown: function() {
        Ember.run(function () {
            if (ct) {
                ct.destroy();
                ct = null;
            }
        });
    }
});

test('Should register and unregister itself', function() {
    ct = Ember.AnimatedContainerView.create({
        name: 'foo'
    });
    equal(Ember.AnimatedContainerView._views['foo'], ct, 'View was registered');
    Ember.run(function(){
        ct.destroy();
        ct = null;
    });
    equal(Ember.AnimatedContainerView._views['foo'], null, 'View was unregistered');
});

test('Should work with an initial currentView', function() {
    ct = Ember.AnimatedContainerView.create({
        name: 'foo',
        currentView: Ember.View.create({
            template: function() {
                return 'Slide, and jump!';
            }
        })
    });
    Ember.run(function() {
        ct.appendTo('#qunit-fixture');
    });
    equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!', 'Text is correct');
});

test('Should insert first currentView without animation even if an animation is queued', function() {
    ct = Ember.AnimatedContainerView.create({
        name: 'foo'
    });
    ct.enqueueAnimation('slideLeft');
    Ember.run(function() {
        ct.appendTo('#qunit-fixture');
    });
    var view = Ember.View.create({
        template: function() {
            return 'Slide, and jump!';
        }
    });
    Ember.run(function() {
        ct.set('currentView', view);
    });
    equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!', 'Text is correct');
});

test('Should change currentView without animation if no animation is queued', function() {
    var oldView = Ember.View.create({
        template: function() {
            return 'Slide, and jump!';
        }
    });
    ct = Ember.AnimatedContainerView.create({
        name: 'foo',
        currentView: oldView
    });
    Ember.run(function() {
        ct.appendTo('#qunit-fixture');
    });
    var newView = Ember.View.create({
        template: function() {
            return 'Now chase the rat!';
        }
    });
    Ember.run(function() {
        ct.set('currentView', newView);
    });
    equal(Ember.$.trim(ct.$().text()), 'Now chase the rat!', 'Only new view\'s text is present');
    equal(oldView.get('isDestroyed'), true, 'Old view was destroyed');
});

test('Should animate through Ember.AnimatedContainerView.enqueueAnimations', function() {
    var oldView = Ember.View.create({
        template: function() {
            return 'Slide, and jump!';
        }
    });
    ct = Ember.AnimatedContainerView.create({
        name: 'foo',
        currentView: oldView
    });
    Ember.run(function() {
        ct.appendTo('#qunit-fixture');
    });
    Ember.AnimatedContainerView.enqueueAnimations({foo: 'fade'});
    var newView = Ember.View.create({
        template: function() {
            return 'Now chase the rat!';
        }
    });
    Ember.run(function() {
        ct.set('currentView', newView);
    });
    equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!Now chase the rat!', 'View has both views\'s texts.');
});

var effects = [
    'fade',
    'flip',
    'slideLeft',
    'slideRight'
];
effects.forEach(function(effect) {
    asyncTest(effect + ' effect', function() {
        var oldView = Ember.View.create({
            template: function() {
                return 'Slide, and jump!';
            }
        });
        ct = Ember.AnimatedContainerView.create({
            name: 'foo',
            currentView: oldView
        });
        Ember.run(function() {
            ct.appendTo('#qunit-fixture');
        });
        ct.enqueueAnimation(effect);
        var newView = Ember.View.create({
            template: function() {
                return 'Now chase the rat!';
            }
        });
        Ember.run(function() {
            ct.set('currentView', newView);
        });
        equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!Now chase the rat!', 'View has both views\'s texts.');
        //Sleep 1 second to allow the animation to finish
        setTimeout(function() {
            equal(Ember.$.trim(ct.$().text()), 'Now chase the rat!', 'Only the new view\'s text is left.');
            equal(oldView.get('isDestroyed'), true, 'Old view was destroyed');
            start();
        }, 1000);
    });
});