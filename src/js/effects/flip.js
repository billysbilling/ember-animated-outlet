Ember.AnimatedOutletView.registerEffect('flip', function(outlet, newView, oldView) {
    var outletEl = outlet.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    outletEl.wrap('<div class="ember-animated-outlet-flip-wrap"></div>')
    outletEl.addClass('ember-animated-outlet-flip-outlet');
    newEl.addClass('ember-animated-outlet-flip-back');
    oldEl.addClass('ember-animated-outlet-flip-front');
    setTimeout(function() {
        outletEl.addClass('ember-animated-outlet-flip-outlet-flipped');
        outletEl.one('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function() {
            outletEl.unwrap();
            outletEl.removeClass('ember-animated-outlet-flip-outlet-flipped');
            outletEl.removeClass('ember-animated-outlet-flip-outlet');
            newEl.removeClass('ember-animated-outlet-flip-back');
            outlet.removeObject(oldView);
        });
    }, 0);
});