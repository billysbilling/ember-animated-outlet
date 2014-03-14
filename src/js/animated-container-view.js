/**
  Write me...
 
  @class AnimatedContainerView
  @namespace Ember
  @extends Ember.ContainerView
*/
Ember.AnimatedContainerView = Ember.ContainerView.extend({

    classNames: ['ember-animated-container'],
    
    init: function() {
        this._super();
        //Register this view, so queued effects can be related with this view by name
        Ember.AnimatedContainerView._views[this.get('name')] = this;
        this._isAnimating = false;
    },
    
    willDestroy: function() {
        this._super();
        //Clean up
        var name = this.get('name');
        delete Ember.AnimatedContainerView._views[name];
        delete Ember.AnimatedContainerView._animationQueue[name];
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
        var newView = Ember.get(this, 'currentView'),
            oldView = Ember.get(this, 'oldView'),
            name = this.get('name'),
            effect = null;
        if (newView) {
            if (oldView) {
                Ember.assert('Ember.AnimatedContainerView can only animate non-virtual views. You need to explicitly define your view class.', !oldView.isVirtual);
                Ember.assert('Ember.AnimatedContainerView can only animate non-virtual views. You need to explicitly define your view class.', !newView.isVirtual);
                //Get and validate a potentially queued effect
                effect = Ember.AnimatedContainerView._animationQueue[name];
                delete Ember.AnimatedContainerView._animationQueue[name];
                if (effect && !Ember.AnimatedContainerView._effects[effect]) {
                    Ember.warn('Unknown animation effect: '+effect);
                    effect = null;
                }
                //Forget about the old view
                this.set('oldView', null);
            }
            //If there is already an animation queued, we should cancel it
            if (this._queuedAnimation) {
                oldView.destroy(); //the oldView has never been visible, and never will be, so we can just destroy it now
                oldView = this._queuedAnimation.oldView; //instead, use the oldView from the queued animation, which is our real currentView
            }
            //Queue this animation and check the queue
            this._queuedAnimation = {
                newView: newView,
                oldView: oldView,
                effect: effect
            };
            this._handleAnimationQueue();
        }
    }, 'currentView'),

    _handleAnimationQueue: function() {
        //If animation is in progress, just stop here. Once the animation has finished, this method will be called again.
        if (this._isAnimating) {
            return;
        }
        var self = this,
            q = this._queuedAnimation;
        if (q) {
            var newView = q.newView,
                oldView = q.oldView,
                effect = q.effect;
            this._queuedAnimation = null;
            //Push the newView to this view, which will append it to the DOM
            this.pushObject(newView);
            if (oldView && effect) {
                //If an effect is queued, then start the effect when the new view has been inserted in the DOM
                this._isAnimating = true;
                newView.one('didInsertElement', function() {
                    Ember.AnimatedContainerView._effects[effect](self, newView, oldView, function() {
                        Em.run(function() {
                            self.removeObject(oldView);
                            oldView.destroy();
                            //Check to see if there are any queued animations
                            self._isAnimating = false;
                            self._handleAnimationQueue();
                        });
                    });
                });
            } else {
                if (oldView) {
                    //If there is no effect queued, then just remove the old view (as would normally happen in a ContainerView)
                    this.removeObject(oldView);
                    oldView.destroy();
                }
            }
        }
    },

    enqueueAnimation: function(effect) {
        Ember.AnimatedContainerView._animationQueue[this.get('name')] = effect;
    },
    
    setCurrentViewAnimated: function(currentView, effect) {
        this.enqueueAnimation(effect);
        this.set('currentView', currentView);
    }

});

Ember.AnimatedContainerView.reopenClass({
    
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
     
      - The `Ember.AnimatedContainerView` instance.
      - The new view.
      - The old view.

      @param {String} effect The name of the effect, e.g. 'slideLeft'
      @param {Function} callback The function to call when effect has to be executed
    */
    registerEffect: function(effect, callback) {
        this._effects[effect] = callback;
    }

});
