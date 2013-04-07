(function() {
    
var slide = function(ct, newView, oldView, direction) {
    var ctEl = ct.$(),
        newEl = newView.$();
    ctEl.addClass('ember-animated-container-slide-'+direction+'-ct');
    newEl.addClass('ember-animated-container-slide-'+direction+'-new');
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-slide-'+direction+'-ct-sliding');
        ctEl.one('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function() {
            ctEl.removeClass('ember-animated-container-slide-'+direction+'-ct');
            ctEl.removeClass('ember-animated-container-slide-'+direction+'-ct-sliding');
            newEl.removeClass('ember-animated-container-slide-'+direction+'-new');
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