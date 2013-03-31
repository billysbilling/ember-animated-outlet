(function() {
    
var slide = function(outlet, newView, oldView, direction) {
    var outletEl = outlet.$(),
        outletWidth = outletEl.outerWidth(),
        outletOriginalLeft = outletEl.css('left'),
        newEl = newView.$(),
        newElOriginalLeft = newEl.css('left'),
        animateLeft;
    if (direction == 'left') {
        newEl.css('left', outletWidth+'px');
        animateLeft = -outletWidth;
    } else {
        newEl.css('left', (-outletWidth)+'px');
        animateLeft = outletWidth;
    }
    outletEl.stop().animate({
        left: animateLeft
    }, function() {
        outletEl.css('left', outletOriginalLeft);
        newEl.css('left', newElOriginalLeft);
        outlet.removeObject(oldView);
    });
};
    
Ember.AnimatedOutletView.registerEffect('slideLeft', function(outlet, newView, oldView) {
    slide(outlet, newView, oldView, 'left');
});

Ember.AnimatedOutletView.registerEffect('slideRight', function(outlet, newView, oldView) {
    slide(outlet, newView, oldView, 'right');
});

})();