Ember.Route.reopen({

    /**
      Works as {@link Ember.Route.transitionTo}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param model
      @param animations {Object} Animations to enqueue
    */
    transitionToAnimated: function(name, model, animations) {
        Ember.Handlebars.AnimatedOutletView.enqueueAnimations(animations);
        return this.transitionTo(name, model);
    },

    /**
      Works as {@link Ember.Route.replaceWith}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param model
      @param animations {Object} Animations to enqueue
    */
    replaceWithAnimated: function(name, model, animations) {
        Ember.Handlebars.AnimatedOutletView.enqueueAnimations(animations);
        return this.replaceWith(name, model);
    }

});