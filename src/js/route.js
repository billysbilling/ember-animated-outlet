Ember.Route.reopen({

  transitionToAnimated: function(name, context) {
      var router = this.router;
      return router.transitionToAnimated.apply(router, arguments);
  },

  replaceWithAnimated: function() {
      var router = this.router;
      return router.replaceWithAnimated.apply(router, arguments);
  }

});
