Ember.AnimatedContainerView.registerEffect('flip', function(outlet, newView, oldView) {
    var outletEl = outlet.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    outletEl.wrap('<div class="ember-animated-container-flip-wrap"></div>')
    outletEl.addClass('ember-animated-container-flip-outlet');
    newEl.addClass('ember-animated-container-flip-back');
    oldEl.addClass('ember-animated-container-flip-front');
    setTimeout(function() {
        outletEl.addClass('ember-animated-container-flip-outlet-flipped');
        outletEl.one('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function() {
            outletEl.unwrap();
            outletEl.removeClass('ember-animated-container-flip-outlet-flipped');
            outletEl.removeClass('ember-animated-container-flip-outlet');
            newEl.removeClass('ember-animated-container-flip-back');
            outlet.removeObject(oldView);
            oldView.destroy();
        });
    }, 0);
});