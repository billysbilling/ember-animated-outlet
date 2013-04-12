(function() {
    
var slide = function(ct, newView, oldView, callback, direction, slow) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        duration = slow ? 2050 : 450;
    ctEl.addClass('ember-animated-container-slide-'+direction+'-ct')
    if (slow) {
        ctEl.addClass('ember-animated-container-slide-slow-ct')
    }
    newEl.addClass('ember-animated-container-slide-'+direction+'-new');
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-slide-'+direction+'-ct-sliding');
        setTimeout(function() {
            ctEl.removeClass('ember-animated-container-slide-'+direction+'-ct');
            if (slow) {
                ctEl.removeClass('ember-animated-container-slide-slow-ct')
            }
            ctEl.removeClass('ember-animated-container-slide-'+direction+'-ct-sliding');
            newEl.removeClass('ember-animated-container-slide-'+direction+'-new');
            callback();
        }, duration);
    }, 0);
};

Ember.AnimatedContainerView.registerEffect('slideLeft', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'left', false);
});

Ember.AnimatedContainerView.registerEffect('slideRight', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'right', false);
});

Ember.AnimatedContainerView.registerEffect('slideUp', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'up', false);
});

Ember.AnimatedContainerView.registerEffect('slideDown', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'down', false);
});

Ember.AnimatedContainerView.registerEffect('slowSlideLeft', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'left', true);
});
    
Ember.AnimatedContainerView.registerEffect('slowSlideRight', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'right', true);
});

Ember.AnimatedContainerView.registerEffect('slowSlideUp', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'up', false);
});

Ember.AnimatedContainerView.registerEffect('slowSlideDown', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'down', false);
});

})();