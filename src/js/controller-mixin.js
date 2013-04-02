Ember.ControllerMixin.reopen({

    /**
      Works as {@link Ember.ControllerMixin.transitionToRoute}} except that it takes a third parameter, `animations`,
      which will enqueue animations.
     
      `animations` should be an object with outlet names as keys and effect names as value.
     
      @param name
      @param model
      @param animations {Object} Animations to enqueue
    */
    transitionToRouteAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.transitionToRoute.apply(this, arguments);
    },

    /**
      Works as {@link Ember.ControllerMixin.replaceRoute}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param model
      @param animations {Object} Animations to enqueue
    */
    replaceRouteAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.replaceRoute.apply(this, arguments);
    }

});