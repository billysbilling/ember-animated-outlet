Ember.AnimatedContainerView.registerEffect('fade', function(ct, newView, oldView) {
    var newEl = newView.$(),
        oldEl = oldView.$();
    newEl.addClass('ember-animated-container-fade-new');
    oldEl.addClass('ember-animated-container-fade-old');
    setTimeout(function() {
        oldEl.addClass('ember-animated-container-fade-old-fading');
        setTimeout(function() {
            newEl.removeClass('ember-animated-container-fade-new');
            ct.removeObject(oldView);
            oldView.destroy();
        }, 550);
    }, 0);
});