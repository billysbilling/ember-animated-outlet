(function() {

var slideOver = function(ct, newView, oldView, callback, direction) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        duration = 450;
    ctEl.addClass('ember-animated-container-slideOver-old');
    Ember.run(function() {
        newEl.addClass('ember-animated-container-slideOver-'+direction+'-new');
        newEl.addClass('ember-animated-container-slideOver-'+direction+'-new-sliding');
        Ember.run.later(function() {
            newEl.removeClass('ember-animated-container-slideOver-'+direction+'-new');
            newEl.removeClass('ember-animated-container-slideOver-'+direction+'-new-sliding');
            ctEl.removeClass('ember-animated-container-slideOver-old');
            callback();
        }, duration);
    });
};

Ember.AnimatedContainerView.registerEffect('slideOverLeft', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'left');
});

Ember.AnimatedContainerView.registerEffect('slideOverRight', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'right');
});

Ember.AnimatedContainerView.registerEffect('slideOverUp', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'up');
});

Ember.AnimatedContainerView.registerEffect('slideOverDown', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'down');
});

})();
