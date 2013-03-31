Ember.Handlebars.AnimatedOutletView.animations.slideLeft = function(outlet, curView, oldView) {
    Ember.AnimatedTransitions._slide(outlet, curView, oldView, 'left');
};

Ember.Handlebars.AnimatedOutletView.animations.slideRight = function(outlet, curView, oldView) {
    Ember.AnimatedTransitions._slide(outlet, curView, oldView, 'right');
};

Ember.Handlebars.AnimatedOutletView.animations._slide = function(outlet, curView, oldView, direction) {
    var outletEl = outlet.$(),
        outletWidth = outletEl.outerWidth(),
        curEl = curView.$(),
        oldEl = oldView.$(),
        animateLeft;
    outletEl.addClass('animated-transition-outlet-slide');
    curEl.addClass('animated-transition-view-slide');
    oldEl.addClass('animated-transition-view-slide');
    if (direction == 'left') {
        curEl.css('left', outletWidth+'px');
        animateLeft = -outletWidth;
    } else {
        curEl.css('left', (-outletWidth)+'px');
        animateLeft = outletWidth;
    }
    outletEl.stop().animate({
        left: animateLeft
    }, function() {
        outletEl.removeClass('animated-transition-outlet-slide');
        outletEl.css('left', '');
        curEl.removeClass('animated-transition-view-slide');
        curEl.css('left', '');
        outlet.removeObject(oldView);
    });
};