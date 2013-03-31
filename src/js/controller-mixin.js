Ember.ControllerMixin.reopen({

    /**
      Works as {@link Ember.ControllerMixin.transitionToRoute}} except that it takes a third parameter, `animations`,
      which will enqueue animations.
     
      `animations` should be an object with outlet names as keys and effect names as value.
     
      @param name
      @param model
      @param animations {Object} Animations to enqueue
    */
    transitionToRouteAnimated: function(name, model, animations) {
        // target may be either another controller or a router
        var target = get(this, 'target'),
            method = target.transitionToRouteAnimated || target.transitionToAnimated;
        return method.apply(target, arguments);
    },

    /**
      Works as {@link Ember.ControllerMixin.replaceRoute}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param model
      @param animations {Object} Animations to enqueue
    */
    replaceRouteAnimated: function(name, model, animations) {
        // target may be either another controller or a router
        var target = get(this, 'target'),
            method = target.replaceRouteAnimated || target.replaceWithAnimated;
        return method.apply(target, arguments);
    }

});