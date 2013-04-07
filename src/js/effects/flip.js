Ember.AnimatedContainerView.registerEffect('flip', function(ct, newView, oldView) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    ctEl.wrap('<div class="ember-animated-container-flip-wrap"></div>')
    ctEl.addClass('ember-animated-container-flip-ct');
    newEl.addClass('ember-animated-container-flip-new');
    oldEl.addClass('ember-animated-container-flip-old');
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-flip-ct-flipping');
        ctEl.one('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function() {
            ctEl.unwrap();
            ctEl.removeClass('ember-animated-container-flip-ct-flipping');
            ctEl.removeClass('ember-animated-container-flip-ct');
            newEl.removeClass('ember-animated-container-flip-new');
            ct.removeObject(oldView);
            oldView.destroy();
        });
    }, 0);
});