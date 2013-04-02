Ember.Route.reopen({

    /**
      Works as {@link Ember.Route.transitionTo}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param animations {Object} Animations to enqueue
      @param model
    */
    transitionToAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.transitionTo.apply(this, arguments);
    },

    /**
      Works as {@link Ember.Route.replaceWith}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param animations {Object} Animations to enqueue
      @param model
    */
    replaceWithAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.replaceWith.apply(this, arguments);
    }

});