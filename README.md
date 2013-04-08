# Ember Animated Outlet [![Build Status](https://travis-ci.org/billysbilling/ember-animated-outlet.png?branch=master)](https://travis-ci.org/billysbilling/ember-animated-outlet)

Ember Animated Outlet is a plug'n'play module to support animated route transitions in [Ember.js](http://emberjs.com/).

The module is maintained by [Billy's Billing online accounting software](http://billysbilling.com/). We use it ourselves
in our upcoming HTML5 mobile app.


## Demo

You can see a live demo here: [ember-animated-outlet-demo.herokuapp.com](http://ember-animated-outlet-demo.herokuapp.com/).


## How to use

It's very easy to use Ember Animated Outlet and get full-fledged animation transitions in your Ember.js app.

### Include Javascript and CSS files in your HTML page

Download the latest version of [ember-animated-outlet.js](http://ember-animated-outlet-demo.herokuapp.com/js/vendor/ember-animated-outlet.js)
(or build it yourself), and include it in your HTML page _after_ the `ember.js` file.

You also need to download and include the latest version of [ember-animated-outlet.css](http://ember-animated-outlet-demo.herokuapp.com/js/vendor/ember-animated-outlet.css)
in the `<head>`.

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/vendor/ember-animated-outlet.css"/>
    <!-- Add your own stylesheets here  -->
</head>
<body>
    <!-- Add your Handlebars templates here  -->
    
    <script src="/vendor/jquery-1.9.0.js"></script>
    <script src="/vendor/handlebars-1.0.rc.3.js"></script>
    <script src="/vendor/ember.js"></script>
    <script src="/vendor/ember-animated-outlet.js"></script>
    <!-- Add your own JavaScript files here  -->
</body>
</html>
```


### Use `{{animatedOutlet}}` instead of `{{outlet}}`

In those outlets where you would like to use animation, use the `{{animatedOutlet}}` helper instead of `{{outlet}}`, which
you would normally use. You need to give the outlet a name. Example:

```handlebars
<h1>Ember Animated Outlet Example</h1>
{{animatedOutlet name="main"}
```

### Use `transitionToAnimated` instead of `transitionTo`

In your JavaScript code where you would normally write `transitionTo` in your routes to transition to another route, you
should use `transitionToAnimated` instead. `transitionToAnimated` takes an extra argument, `animations`, which should be the second
argument right after the name of the route to transition to.

`animations` should be a hash with outlet names (the one you set in `{{animatedOutlet}}`) as keys and effect names as keys.

```javascript
App.ApplicationRoute = Ember.Route.extend({
    showInvoice: function(invoice) {
        this.transitionToAnimated('invoices.show', {main: 'slideLeft'}, invoice);
    }
});
```

There are `*Animated` versions of all the different ways you can transition between routes:

| Class | Normal method | Animated method |
| ----- | ------------- | --------------- |
| `Ember.Route` | `transitionTo(name, model)` | `transitionToAnimated(name, animations, model)` |
| `Ember.Route` | `replaceWith(name, model)` | `replaceWithAnimated(name, animations, model)` |
| `Ember.Controller` | `transitionToRoute(name, model)` | `transitionToRouteAnimated(name, animations, model)` |
| `Ember.Controller` | `replaceRoute(name, model)` | `replaceRouteAnimated(name, animations, model)` |

You can also programmatically enqueue an animation for an outlet. A good example is when manually manipulating the `history`.
 
```javascript
App.ApplicationRoute = Ember.Route.extend({
    goBack: function(invoice) {
        Ember.AnimatedContainerView.enqueueAnimations({main: 'slideRight'});
        history.go(-1);
    }
});
```

You can have as many `{{animatedOutlet}}`s as you would like. In most cases a route transition will only include one animation.
But since the `animations` argument is a hash, you can enqueue multiple animations:

```javascript
App.ApplicationRoute = Ember.Route.extend({
    showInvoice: function(invoice) {
        this.transitionToAnimated('invoices.show', {main: 'slideLeft', invoice: 'fade'}, invoice);
    }
});
```

That's all it takes!

### List of available effects

You can use the following effects:

| Effect name | Description |
| ----------- | ----------- | 
| `fade` | The old view will be faded out, revealing the new view underneath it. Uses CSS transitions. |
| `flip` | Using CSS3 to perform a 3D flip. |
| `slideLeft` | A slide animation where the views slide towards the left side of the screen. Uses CSS transitions. |
| `slideRight` | A slide animation where the views slide towards the right side of the screen. Uses CSS transitions. |

Is your favorite effect missing? Fork the repo, send a pull request, and make other folks happy, too :-)


## Tested in

- OSX
- - Chrome 26
- - Safari 6.0.2
- - Firefox 19
- iOS
- - Chrome 25
- - Safari 6.0

If you experience issues in any browser, please [file an issue](https://github.com/billysbilling/ember-animated-outlet/issues).

## Things to be aware of

- All child views of an `App.AnimatedContainerView` need to be explicitly defined, since the animations only work with non-virtual views.
  This means that if you have a route called `invoices.show` and you expect to animate into it, you need to define the view for it:
  `App.InvoicesShowView = Ember.View.extend()`
- The `{{animatedOutlet}}` helper should be contained in an element that has `position: relative`. The outlet element is
  automatically absolutely positioned (set to top:0 and left:0) and will automatically size itself to be 100% width and
  100% height of the parent.
- Pressing the browser's back button will not perform any animation, unless you tap into the Ember code that handles
  the `popstate`/`hashchange` event.


## Building and testing

### Setup

To be able to build and test you need to have the following installed:

- [Node.js](http://nodejs.org/)
- The NPM package `grunt-cli` (can be installed via `npm install -g grunt-cli`, [see more here](http://gruntjs.com/getting-started))

Run `npm install` from the project direction to install dependencies.

### Building

You can build the project simply by running `grunt` in your terminal. If you want to let Grunt watch your files, so it 
automatically builds every time you change something, you can run `grunt watch`.

The build process will place the files `ember-animated-outlet.js`, `ember-animated-outlet.min.js` and
`ember-animated-outlet.css` in the `dist/` folder.

### Testing

You can run tests by starting the test server:

```
node tests/server.js
```

And then open `http://localhost:7846/` in your browser.

The test suite uses [QUnit](http://qunitjs.com/).


## Todo

- Upload dist files somewhere
- Tests
-- Is there a better way than to use `setTimeout` to wait for animations to finish?
- Write missing jsdoc for some classes 
- Documentation of using Ember.AnimatedContainerView programmatically
