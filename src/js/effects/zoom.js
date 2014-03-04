(function() {
    
var zoom = function(ct, newView, oldView, callback, direction) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    ctEl.addClass('ember-animated-container-zoom-'+direction+'-ct');
    newEl.addClass('ember-animated-container-zoom-new');
    oldEl.addClass('ember-animated-container-zoom-old');
    
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-zoom-ct-zooming');
        setTimeout(function() {
            ctEl.removeClass('ember-animated-container-zoom-'+direction+'-ct');
            ctEl.removeClass('ember-animated-container-zoom-ct-zooming');
            newEl.removeClass('ember-animated-container-zoom-new');
            callback();
        }, 450);
    }, 0);
};

Ember.AnimatedContainerView.registerEffect('zoomIn', function(ct, newView, oldView, callback) {
    zoom(ct, newView, oldView, callback, 'in');
});

Ember.AnimatedContainerView.registerEffect('zoomOut', function(ct, newView, oldView, callback) {
    zoom(ct, newView, oldView, callback, 'out');
});

})();