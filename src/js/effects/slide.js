(function() {
    
var slide = function(ct, newView, oldView, direction) {
    var ctEl = ct.$(),
        newEl = newView.$();
    ctEl.addClass('ember-animated-container-slide-ct');
    newEl.addClass('ember-animated-container-slide-new');
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-slide-ct-sliding-'+direction);
        ctEl.one('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function() {
            ctEl.removeClass('ember-animated-container-slide-ct');
            ctEl.removeClass('ember-animated-container-slide-ct-sliding-'+direction);
            newEl.removeClass('ember-animated-container-slide-new');
            ct.removeObject(oldView);
            oldView.destroy();
        });
    }, 0);
};
    
Ember.AnimatedContainerView.registerEffect('slideLeft', function(ct, newView, oldView) {
    slide(ct, newView, oldView, 'left');
});

Ember.AnimatedContainerView.registerEffect('slideRight', function(ct, newView, oldView) {
    slide(ct, newView, oldView, 'right');
});

})();