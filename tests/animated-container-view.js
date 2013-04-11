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
    var newView = Ember.View.create({
        template: function() {
            return 'Now chase the rat!';
        }
    });
    Ember.run(function() {
        Ember.AnimatedContainerView.enqueueAnimations({foo: 'fade'});
        ct.set('currentView', newView);
    });
    equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!Now chase the rat!', 'Container has both views\'s texts.');
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
        var newView = Ember.View.create({
            template: function() {
                return 'Now chase the rat!';
            }
        });
        Ember.run(function() {
            ct.enqueueAnimation(effect);
            ct.set('currentView', newView);
        });
        equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!Now chase the rat!', 'Container has both views\'s texts.');
        //Sleep 1 second to allow the animation to finish
        setTimeout(function() {
            equal(Ember.$.trim(ct.$().text()), 'Now chase the rat!', 'Only the new view\'s text is left.');
            equal(oldView.get('isDestroyed'), true, 'Old view was destroyed');
            start();
        }, 1000);
    });
});


asyncTest('Queuing multiple animations', function() {
    var view1 = Ember.View.create({
        template: function() {
            return 'Slide, and jump!';
        }
    });
    ct = Ember.AnimatedContainerView.create({
        name: 'foo',
        currentView: view1
    });
    Ember.run(function() {
        ct.appendTo('#qunit-fixture');
    });
    var view2 = Ember.View.create({
        template: function() {
            return 'Now chase the rat!';
        }
    });
    Ember.run(function() {
        ct.enqueueAnimation('slideLeft');
        ct.set('currentView', view2);
    });
    setTimeout(function() {
        var view3 = Ember.View.create({
            template: function() {
                return 'Go go sugar Pops!';
            }
        });
        Ember.run(function() {
            ct.enqueueAnimation('slideLeft');
            ct.set('currentView', view3);
        });
        var view4 = Ember.View.create({
            template: function() {
                return 'Stop!';
            }
        });
        Ember.run(function() {
            ct.enqueueAnimation('slideLeft');
            ct.set('currentView', view4);
        });
        equal(Ember.$.trim(ct.$().text()), 'Slide, and jump!Now chase the rat!', 'Container still has only the two first views\'s texts.');
        //Sleep 450ms to allow the first animation to finish
        setTimeout(function() {
            equal(Ember.$.trim(ct.$().text()), 'Now chase the rat!Stop!', 'Container has view2 and view 4\'s texts.');
            equal(view1.get('isDestroyed'), true, 'view1 was destroyed');
            equal(view3.get('isDestroyed'), true, 'view3 view was destroyed (it was never really visible)');
            setTimeout(function() {
                equal(Ember.$.trim(ct.$().text()), 'Stop!', 'Container only has view4\'s text.');
                equal(view2.get('isDestroyed'), true, 'view2 was destroyed');
                start();
            }, 1000);
        }, 450);
    }, 100)
});