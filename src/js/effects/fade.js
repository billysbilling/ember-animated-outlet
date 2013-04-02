Ember.AnimatedContainerView.registerEffect('fade', function(outlet, newView, oldView) {
    var outletEl = outlet.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    newEl.css({zIndex: 1});
    oldEl.css({zIndex: 2});
    oldEl.stop().animate({
        opacity: 0
    }, function() {
        outletEl.removeClass('ember-animated-container-fade-outlet');
        newEl.removeClass('ember-animated-container-fade-view-new');
        outlet.removeObject(oldView);
        oldView.destroy();
    });
});