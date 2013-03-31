/**
  Write me...
 
  @class AnimatedOutletView
  @namespace Ember
  @extends Ember.ContainerView
*/
Ember.AnimatedOutletView = Ember.ContainerView.extend({

    classNames: ['ember-animated-outlet'],
    
    init: function() {
        this._super();
        //Register this view, so queued effects can be related with this view by name
        Ember.AnimatedOutletView._views[this.get('name')] = this;
    },
    
    willDestroy: function() {
        this._super();
        //Clean up
        delete Ember.AnimatedOutletView._views[this.get('name')];
    },
    
    //Override parent method
    _currentViewWillChange: Ember.beforeObserver(function() {
        var currentView = Ember.get(this, 'currentView');
        if (currentView) {
            //Store the old `currentView` (and don't destroy it yet) so we can use it for animation later
            this.set('oldView', currentView);
        }
    }, 'currentView'),

    _currentViewDidChange: Ember.observer(function() {
        var self = this,
            newView = Ember.get(this, 'currentView'),
            oldView = Ember.get(this, 'oldView'),
            name = this.get('name');
        if (newView) {
            this.pushObject(newView);
            //Only animate if there is both a new view and an old view
            if (oldView) {
                Ember.assert('Ember.AnimatedOutletView can only animate non-virtual views. You need to explicitly define your view class.', !oldView.isVirtual);
                Ember.assert('Ember.AnimatedOutletView can only animate non-virtual views. You need to explicitly define your view class.', !newView.isVirtual);
                //Get and validate a potentially queued effect
                var effect = Ember.AnimatedOutletView._animationQueue[name];
                if (effect && !Ember.AnimatedOutletView._effects[effect]) {
                    Ember.warn('Unknown animation effect: '+effect);
                    effect = null;
                }
                if (effect) {
                    //If an effect is queued, then start the effect when the new view has been inserted
                    delete Ember.AnimatedOutletView._animationQueue[name];
                    newView.on('didInsertElement', function() {
                        Ember.AnimatedOutletView._effects[effect](self, newView, oldView);
                    });
                } else {
                    //If there is no effect queued, then just remove the old view (as would normally happen in a ContainerView)
                    this.removeObject(oldView);
                }
                //Forget about the old view
                this.set('oldView', null);
            }
        }
    }, 'currentView')

});

Ember.AnimatedOutletView.reopenClass({
    
    /**
      All animated outlets registers itself in this hash
       
      @private
      @property {Object} _views
    */
    _views: {},

    /**
      Whenever an animated route transition is set in motion, it will be stored here, so the animated outlet view can pick it up

      @private
      @property {Object} _animationQueue
    */
    _animationQueue: {},

    /**
      Enqueue effects to be executed by the given outlets when the next route transition happens.
      
      @param {Object} animations A hash with keys corresponding to outlet views and values with the desired animation effect.
    */
    enqueueAnimations: function(animations) {
        for (var name in animations) {
            if (!animations.hasOwnProperty(name)) continue;
            this._animationQueue[name] = animations[name];
        }
    },

    /**
      All animation effects are stored on this object and can be referred to by its key

      @private
      @property {Object} effects
    */
    _effects: {},


    /**
      Register a new effect.
     
      The `callback` function will be passed the following parameters:
     
      - The `Ember.AnimatedOutletView` instance.
      - The new view.
      - The old view.

      @param {String} effect The name of the effect, e.g. 'slideLeft'
      @param {Function} callback The function to call when effect has to be executed
    */
    registerEffect: function(effect, callback) {
        this._effects[effect] = callback;
    }

});