# Ember Animated Outlet
=====================

## Things to be aware of

- All child views of an `App.AnimatedOutletView` need to be explicitly defined, since the animations only work with non-virtual views.
  This means that if you have a route called `invoices.show` and you expect to animate into it, you need to define the view for it:
  `App.InvoicesShowView = Ember.View.extend()`
- The `{{animatedOutlet}}` helper should be contained in an element that has `position: relative`. It will automatically size itself
  to be 100% width and 100% height of the parent.
- Pressing the back button will not perform any animation, unless you tap into the Ember code that handles the popState/hashchange event.