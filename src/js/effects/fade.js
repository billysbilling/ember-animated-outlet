Ember.AnimatedContainerView.registerEffect('fade', function(ct, newView, oldView, callback) {
    var newEl = newView.$(),
        oldEl = oldView.$();
    newEl.addClass('ember-animated-container-fade-new');
    oldEl.addClass('ember-animated-container-fade-old');
    Ember.run(function() {
        oldEl.addClass('ember-animated-container-fade-old-fading');
        Ember.run.later(function() {
            newEl.removeClass('ember-animated-container-fade-new');
            callback();
        }, 550);
    });
});
