# Ember Animated Outlet [![Build Status](https://travis-ci.org/billysbilling/ember-animated-outlet.png?branch=master)](https://travis-ci.org/billysbilling/ember-animated-outlet)

Ember Animated Outlet is a plug'n'play module to support animated route transitions in [Ember.js](http://emberjs.com/).

The module is maintained by [Billy's Billing online accounting software](http://billysbilling.com/). We use it ourselves
in our upcoming HTML5 mobile app.

Works with Ember.js 1.0.0. Has also been tested with Ember.js 1.3.0-beta (as of https://github.com/emberjs/ember.js/commit/0fcc6f8d236152439c68034d87ff74d133cf8b50).


## Demo

You can see a live demo here: [ember-animated-outlet-demo.herokuapp.com](http://ember-animated-outlet-demo.herokuapp.com/).


## How to use

It's very easy to use Ember Animated Outlet and get full-fledged animation transitions in your Ember.js app.

### Include Javascript and CSS files in your HTML page

Download the latest version of [ember-animated-outlet.js](https://raw.github.com/billysbilling/ember-animated-outlet/master/dist/ember-animated-outlet.js)
(or build it yourself), and include it in your HTML page _after_ the `ember.js` file.

You also need to download and include the latest version of [ember-animated-outlet.css](https://raw.github.com/billysbilling/ember-animated-outlet/master/dist/ember-animated-outlet.css)
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

    <script src="/vendor/jquery.js"></script>
    <script src="/vendor/handlebars.js"></script>
    <script src="/vendor/ember.js"></script>
    <script src="/vendor/ember-animated-outlet.js"></script>
    <!-- Add your own JavaScript files here  -->
</body>
</html>
```


### Use `{{animated-outlet}}` instead of `{{outlet}}`

In those outlets where you would like to use animation, use the `{{animated-outlet}}` helper instead of `{{outlet}}`, which
you would normally use. You need to give the outlet a name. Example:

```handlebars
<h1>Ember Animated Outlet Example</h1>
{{animated-outlet name="main"}}
```


### Use `link-to-animated` instead of `link-to`

When you want to use the animations from your Handlebars templates, you can use `link-to-animated`. The syntax  for `link-to-animated`is:

```handlebars
{{#link-to-animated "invoices.show" invoice animations="main:slideLeft"}}
```

Where:
- `invoices.show` is the route
- `invoice` is the model
- `main:slideLeft` is the animation

When you are not using a model, the syntax is:

```handlebars
{{#link-to-animated "index" animations="main:fade"}}Introduction{{/link-to-animated}}
```


### Use `transitionToAnimated` instead of `transitionTo`

In your JavaScript code where you would normally write `transitionTo` in your routes to transition to another route, you
should use `transitionToAnimated` instead. `transitionToAnimated` takes an extra argument, `animations`, which should be the second
argument right after the name of the route to transition to.

`animations` should be a hash with outlet names (the one you set in `{{animated-outlet}}`) as keys and effect names as values.

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

You can have as many `{{animated-outlet}}`s as you would like. In most cases a route transition will only include one animation.
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
| `slideUp` | A slide animation where the views slide towards the top side of the screen. Uses CSS transitions. |
| `slideRight` | A slide animation where both views slide towards the right side of the screen. Uses CSS transitions. |
| `slideDown` | A slide animation where both views slide towards the bottom side of the screen. Uses CSS transitions. |
| `slideLeft` | A slide animation where both views slide towards the left side of the screen. Uses CSS transitions. |
| `slideOverUp` | Same as slideUp, but original view remains in place. Uses CSS transitions. |
| `slideOverRight` | Same as slideRight, but original view remains in place. Uses CSS transitions. |
| `slideOverDown` | Same as slideDown, but original view remains in place. Uses CSS transitions. |
| `slideOverLeft` | Same as slideLeft, but original view remains in place. Uses CSS transitions. |

Is your favorite effect missing? Fork the repo, send a pull request, and make other folks happy, too :-)


## Tested in

- OSX
    - Chrome 26
    - Safari 6.0.2
    - Firefox 19
- iOS
    - Chrome 25
    - Safari 6.0

If you experience issues in any browser, please [file an issue](https://github.com/billysbilling/ember-animated-outlet/issues).

## Things to be aware of

- All child views of an `App.AnimatedContainerView` need to be explicitly defined, since the animations only work with non-virtual views.
  This means that if you have a route called `invoices.show` and you expect to animate into it, you need to define the view for it:
  `App.InvoicesShowView = Ember.View.extend()`
- The `{{animated-outlet}}` helper should be contained in an element that has `position: relative`. The outlet element is
  automatically absolutely positioned (set to top:0 and left:0) and will automatically size itself to be 100% width and
  100% height of the parent.
- The animations use CSS transitions. There is no fallback for older browsers (yet).
- Pressing the browser's back button will not perform any animation, unless you tap into the Ember code that handles
  the `popstate`/`hashchange` event.
- Animations are not executed when transitioning to the same route with a different model. This is due to the way Ember reuses the same DOM element, and will likely not be fixed until animation support lands in Ember core in 1.1.


## Building and testing

### Setup

To be able to build and test you need to have the following installed:

- [Node.js](http://nodejs.org/)
- The NPM package `grunt-cli` (can be installed via `npm install -g grunt-cli`, [see more here](http://gruntjs.com/getting-started))

Run `npm install` from the project directory to install dependencies.

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

- Include the view's name in "Ember.AnimatedContainerView can only animate non-virtual views. You need to explicitly define your view class"
- Eliminate the need to concrete views
- "Freeze" the exiting view, so its content won't be changed by e.g. a controller change.
- Tap into the browser back button logic in ember to make it use animations too.
- Option to ignore all animations to allow users who don't like it to disable it.
- Tests
    - Is there a better way than to use `setTimeout` to wait for animations to finish?
- Write missing jsdoc for some classes
- Documentation of using Ember.AnimatedContainerView programmatically
