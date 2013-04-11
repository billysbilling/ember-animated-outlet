/**
@module ember
@submodule ember-routing
*/

var get = Ember.get, set = Ember.set;

Ember.onLoad('Ember.Handlebars', function(Handlebars) {
  var resolveParams = Ember.Router.resolveParams,
      isSimpleClick = Ember.ViewUtils.isSimpleClick;

  function fullRouteName(router, name) {
    if (!router.hasRoute(name)) {
      name = name + '.index';
    }

    return name;
  }

  function resolvedPaths(options) {
    var types = options.options.types.slice(1),
        data = options.options.data;

    return resolveParams(options.context, options.params, { types: types, data: data });
  }

  function args(linkView, router, route) {
    var passedRouteName = route || linkView.namedRoute, routeName;

    routeName = fullRouteName(router, passedRouteName);
    Ember.assert("The route " + passedRouteName + " was not found", router.hasRoute(routeName));

    var ret = [ routeName ];

    animations = linkView.parameters.animations;

    return ret.concat(animations, resolvedPaths(linkView.parameters));
  }


  /**
    Renders a link to the supplied route using animation.

    @class AnimatedLinkView
    @namespace Ember
    @extends Ember.LinkView
  **/
  var AnimatedLinkView = Ember.AnimatedLinkView = Ember.LinkView.extend({
    click: function(event) {
      if (!isSimpleClick(event)) { return true; }

      event.preventDefault();
      if (this.bubbles === false) { event.stopPropagation(); }

      var router = this.get('router');
      var route = this.get('container').lookup('route:' + this.get('namedRoute'));

      if (this.get('replace')) {
        route.replaceWithAnimated.apply(router, args(this, router));
      } else {
        route.transitionToAnimated.apply(router, args(this, router));
      }
    }
  });

  AnimatedLinkView.toString = function() { return "AnimatedLinkView"; };

  /**
    @method linkToAnimated
    @for Ember.Handlebars.helpers
    @param {String} routeName
    @param {Object} [context]*
    @return {String} HTML string
  */
  Ember.Handlebars.registerHelper('linkToAnimated', function(name) {
    var options = [].slice.call(arguments, -1)[0];
    var params = [].slice.call(arguments, 1, -1);
    var hash = options.hash;

    Ember.assert("linkToAnimated must contain animations", typeof(hash.animations) == 'string')
    var re = /\s*([a-z]+)\s*:\s*([a-z]+)/gi;
    var animations = {};
    while (match = re.exec(hash.animations)) {
      animations[match[1]] = match[2];
    }
    delete(hash.animations)
    hash.namedRoute = name;
    hash.currentWhen = hash.currentWhen || name;

    hash.parameters = {
      context: this,
      options: options,
      animations: animations,
      params: params
    };

    return Ember.Handlebars.helpers.view.call(this, AnimatedLinkView, options);
  });

});

