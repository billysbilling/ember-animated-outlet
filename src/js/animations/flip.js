Ember.AnimatedOutletView.registerEffect('flip', function(outlet, curView, oldView) {
    var outletEl = outlet.$(),
        curEl = curView.$(),
        oldEl = oldView.$();
    outletEl.wrap('<div class="animated-transition-wrap-flip"></div>')
    outletEl.addClass('animated-transition-outlet-flip');
    curEl.addClass('animated-transition-view-flip-back');
    oldEl.addClass('animated-transition-view-flip-front');
    setTimeout(function() {
        outletEl.addClass('animated-transition-outlet-flip-flipped');
    }, 1);
    setTimeout(function() {
        outletEl.unwrap();
        outletEl.removeClass('animated-transition-outlet-flip-flipped');
        outletEl.removeClass('animated-transition-outlet-flip');
        curEl.removeClass('animated-transition-view-flip-back');
        outlet.removeObject(oldView);
    }, 1000);
});