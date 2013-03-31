Ember.AnimatedOutletView.registerEffect('fade', function(outlet, newView, oldView) {
    var outletEl = outlet.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    newEl.css({zIndex: 1});
    oldEl.css({zIndex: 2});
    oldEl.stop().animate({
        opacity: 0
    }, function() {
        outletEl.removeClass('ember-animated-outlet-fade-outlet');
        newEl.removeClass('ember-animated-outlet-fade-view-new');
        outlet.removeObject(oldView);
    });
});