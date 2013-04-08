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
        setTimeout(function() {
            ctEl.unwrap();
            ctEl.removeClass('ember-animated-container-flip-ct');
            ctEl.removeClass('ember-animated-container-flip-ct-flipping');
            newEl.removeClass('ember-animated-container-flip-new');
            ct.removeObject(oldView);
            oldView.destroy();
        }, 650);
    }, 0);
});