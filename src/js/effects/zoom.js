(function() {
    
var zoom = function(ct, newView, oldView, callback, direction) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        duration = 450;

    ctEl.addClass('ember-animated-container-zoom-ct')
    
    oldView.addClass('ember-animated-container-zoom-'+direction+'-old');
    newEl.addClass('ember-animated-container-zoom-'+direction+'-new');
    
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-zoom-ct-zooming');
        setTimeout(function() {
            ctEl.removeClass('ember-animated-container-zoom-'+direction+'-ct');            
            ctEl.removeClass('ember-animated-container-zoom-ct-zooming');
            newEl.removeClass('ember-animated-container-zoom-'+direction+'-new');
            setTimeout(function() {
                callback();
            }, 0);
        }, duration);
    }, 0);
};

Ember.AnimatedContainerView.registerEffect('zoomIn', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'in');
});

Ember.AnimatedContainerView.registerEffect('zoomOut', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'out');
});

})();