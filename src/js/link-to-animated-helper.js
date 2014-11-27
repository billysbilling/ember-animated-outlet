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
    //`routeArgs` is a private property that was renamed to `loadedParams` between Ember 1.6.0 and 1.7.0 (https://github.com/emberjs/ember.js/commit/f7f7748c3316c44ddfa5b0dd4270b47e1bbb8d60#diff-25e24f888eb418fd3daaf17d5dae0a69R495)
    var routeArgs = get(linkView, 'routeArgs');
    if (!routeArgs) {
        var loadedParams = get(linkView, 'loadedParams');
        routeArgs = [loadedParams.targetRouteName].concat(loadedParams.models);
    }

    var ret = routeArgs.slice(),
        animations = linkView.parameters.animations;
    ret.splice(1, 0, animations);
    return ret;
  }

  /**
    Renders a link to the supplied route using animation.

    @class AnimatedLinkView
    @namespace Ember
    @extends Ember.LinkView
  **/
  var AnimatedLinkView = Ember.AnimatedLinkView = Ember.LinkView.extend({
    _invoke: function(event) {
      if (!isSimpleClick(event)) { return true; }

      event.preventDefault();
      if (this.bubbles === false) { event.stopPropagation(); }

      if (get(this, '_isDisabled')) { return false; }

      if (get(this, 'loading')) {
        Ember.Logger.warn("This link-to is in an inactive loading state because at least one of its parameters presently has a null/undefined value, or the provided route name is invalid.");
        return false;
      }

      var router = this.get('router'),
          routeArgs = args(this, router);

      if (get(this, ('replace'))) {
        router.replaceWithAnimated.apply(router, routeArgs);
      } else {
        router.transitionToAnimated.apply(router, routeArgs);
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
  Ember.Handlebars.registerHelper('link-to-animated', function(name) {
    var options = [].slice.call(arguments, -1)[0],
        params = [].slice.call(arguments, 0, -1),
        hash = options.hash;

    Ember.assert("link-to-animated must contain animations", typeof(hash.animations) == 'string')
    var re = /\s*([a-z]+)\s*:\s*([a-z]+)/gi;
    var animations = {};
    while (match = re.exec(hash.animations)) {
      animations[match[1]] = match[2];
    }
    delete(hash.animations)
    hash.namedRoute = name;
    hash["current-when"] = hash["current-when"] || name;
    hash.disabledBinding = hash.disabledWhen;

    hash.parameters = {
      context: this,
      options: options,
      animations: animations,
      params: params
    };

    return Ember.Handlebars.helpers.view.call(this, AnimatedLinkView, options);
  });

  /**
    See link-to-animated

    @method linkTo
    @for Ember.Handlebars.helpers
    @deprecated
    @param {String} routeName
    @param {Object} [context]*
    @return {String} HTML string
  */
  Ember.Handlebars.registerHelper('linkToAnimated', function() {
    Ember.warn("The 'linkToAnimated' view helper is deprecated in favor of 'link-to-animated'");
    return Ember.Handlebars.helpers['link-to-animated'].apply(this, arguments);
  });

});
