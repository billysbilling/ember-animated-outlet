/*

These tests are a shameless copy of the tests for linkTo helper of Ember.js

*/
var Router, App, AppView, templates, router, eventDispatcher, container;
var get = Ember.get, set = Ember.set;

function bootApplication() {
  router = container.lookup('router:main');
  Ember.run(App, 'advanceReadiness');
}

// IE includes the host name
function normalizeUrl(url) {
  return url.replace(/https?:\/\/[^\/]+/,'');
}

function compile(template) {
  return Ember.Handlebars.compile(template);
}

module("The {{link-to-animated}} helper", {
  setup: function() {
    Ember.run(function() {
      App = Ember.Application.create({
        name: "App",
        rootElement: '#qunit-fixture'
      });

      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });

      Router = App.Router;

      Ember.TEMPLATES.app = Ember.Handlebars.compile("{{outlet}}");
      Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{#link-to-animated 'about' id='about-link' animations='main:fade'}}About{{/link-to-animated}}{{#link-to-animated 'index' id='self-link' animations='main:fade'}}Self{{/link-to-animated}}");
      Ember.TEMPLATES.about = Ember.Handlebars.compile("<h3>About</h3>{{#link-to-animated 'index' id='home-link' animations='main:fade'}}Home{{/link-to-animated}}{{#link-to-animated 'about' id='self-link' animations='main:fade'}}Self{{/link-to-animated}}");
      Ember.TEMPLATES.item = Ember.Handlebars.compile("<h3>Item</h3><p>{{name}}</p>{{#link-to-animated 'index' id='home-link' animations='main:fade'}}Home{{/link-to-animated}}");

      AppView = Ember.View.extend({
        templateName: 'app'
      });

      container = App.__container__;

      container.register('view:app', AppView);
      container.register('router:main', Router);
    });
  },

  teardown: function() {
    Ember.run(function() { App.destroy(); });
  }
});

test("moves into the named route", function() {
  Router.map(function(match) {
    this.route("about");
  });

  bootApplication();

  Ember.run(function() {
    router.handleURL("/");
  });

  equal(Ember.$('h3:contains(Home)', '#qunit-fixture').length, 1, "The home template was rendered");
  equal(Ember.$('#self-link.active', '#qunit-fixture').length, 1, "The self-link was rendered with active class");
  equal(Ember.$('#about-link:not(.active)', '#qunit-fixture').length, 1, "The other link was rendered without active class");

  Ember.run(function() {
    Ember.$('#about-link', '#qunit-fixture').click();
  });

  equal(Ember.$('h3:contains(About)', '#qunit-fixture').length, 1, "The about template was rendered");
  equal(Ember.$('#self-link.active', '#qunit-fixture').length, 1, "The self-link was rendered with active class");
  equal(Ember.$('#home-link:not(.active)', '#qunit-fixture').length, 1, "The other link was rendered without active class");
});

test("supports URL replacement", function() {
  var setCount = 0,
      replaceCount = 0;

  Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{#link-to-animated 'about' id='about-link' animations='main:fade' replace=true}}About{{/link-to-animated}}");

  Router.reopen({
    location: Ember.NoneLocation.createWithMixins({
      setURL: function(path) {
        setCount++;
        set(this, 'path', path);
      },

      replaceURL: function(path) {
        replaceCount++;
        set(this, 'path', path);
      }
    })
  });

  Router.map(function() {
    this.route("about");
  });

  bootApplication();

  Ember.run(function() {
    router.handleURL("/");
  });

  equal(setCount, 0, 'precond: setURL has not been called');
  equal(replaceCount, 0, 'precond: replaceURL has not been called');

  Ember.run(function() {
    Ember.$('#about-link', '#qunit-fixture').click();
  });

  equal(setCount, 0, 'setURL should not be called');
  equal(replaceCount, 1, 'replaceURL should be called once');
});

test("asserts when no animations given", function() {
  Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{#link-to-animated 'about'}}About{{/link-to-animated}}{{#link-to-animated 'index' id='self-link' animations='main:fade' activeClass='zomg-active'}}Self{{/link-to-animated}}");

  Router.map(function() {
    this.route("about");
  });

  expectAssertion(function() {
    bootApplication();
  }, /must contain animations/, "link-to-animated must contain animations");
});


test("passes when empty animations given", function() {
  Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{#link-to-animated 'about' animations=''}}About{{/link-to-animated}}{{#link-to-animated 'index' id='self-link' animations='main:fade' activeClass='zomg-active'}}Self{{/link-to-animated}}");

  Router.map(function() {
    this.route("about");
  });
  bootApplication();
  ok(true) ; // Nothing to test, just beeïng here is enough

});


test("supports a custom activeClass", function() {
  Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{#link-to-animated 'about' id='about-link' animations='main:fade'}}About{{/link-to-animated}}{{#link-to-animated 'index' id='self-link' animations='main:fade' activeClass='zomg-active'}}Self{{/link-to-animated}}");

  Router.map(function() {
    this.route("about");
  });

  bootApplication();

  Ember.run(function() {
    router.handleURL("/");
  });

  equal(Ember.$('h3:contains(Home)', '#qunit-fixture').length, 1, "The home template was rendered");
  equal(Ember.$('#self-link.zomg-active', '#qunit-fixture').length, 1, "The self-link was rendered with active class");
  equal(Ember.$('#about-link:not(.active)', '#qunit-fixture').length, 1, "The other link was rendered without active class");
});

test("supports leaving off .index for nested routes", function() {
  Router.map(function() {
    this.resource("about", function() {
      this.route("item");
    });
  });

  Ember.TEMPLATES.about = compile("<h1>About</h1>{{outlet}}");
  Ember.TEMPLATES['about/index'] = compile("<div id='index'>Index</div>");
  Ember.TEMPLATES['about/item'] = compile("<div id='item'>{{#link-to-animated 'about' animations='main:fade'}}About{{/link-to-animated}}</div>");

  bootApplication();

  Ember.run(function() {
    router.handleURL("/about/item");
  });

  equal(Ember.$('#item a', '#qunit-fixture').attr('href'), '/about');
});

test("supports custom, nested, currentWhen", function() {
  Router.map(function(match) {
    this.resource("index", { path: "/" }, function() {
      this.route("about");
    });

    this.route("item");
  });

  Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{outlet}}");
  Ember.TEMPLATES['index/about'] = Ember.Handlebars.compile("{{#link-to-animated 'item' id='other-link' animations='main:fade' currentWhen='index'}}ITEM{{/link-to-animated}}");

  bootApplication();

  Ember.run(function() {
    router.handleURL("/about");
  });

  equal(Ember.$('#other-link.active', '#qunit-fixture').length, 1, "The link is active since currentWhen is a parent route");
});

test("defaults to bubbling", function() {
  Ember.TEMPLATES.about = Ember.Handlebars.compile("<div {{action 'hide'}}>{{#link-to-animated 'about.contact' animations='main:fade' id='about-contact'}}About{{/link-to-animated}}</div>{{outlet}}");
  Ember.TEMPLATES['about/contact'] = Ember.Handlebars.compile("<h1 id='contact'>Contact</h1>");

  Router.map(function() {
    this.resource("about", function() {
      this.route("contact");
    });
  });

  var hidden = 0;

  App.AboutRoute = Ember.Route.extend({
    actions: {
      hide: function() {
        hidden++;
      }
    }
  });

  bootApplication();

  Ember.run(function() {
    router.handleURL("/about");
  });

  Ember.run(function() {
    Ember.$('#about-contact', '#qunit-fixture').click();
  });

  equal(Ember.$("#contact", "#qunit-fixture").text(), "Contact", "precond - the link worked");

  equal(hidden, 1, "The link bubbles");
});

test("supports bubbles=false", function() {
  Ember.TEMPLATES.about = Ember.Handlebars.compile("<div {{action 'hide'}}>{{#link-to-animated 'about.contact' animations='main:fade' id='about-contact' bubbles=false}}About{{/link-to-animated}}</div>{{outlet}}");
  Ember.TEMPLATES['about/contact'] = Ember.Handlebars.compile("<h1 id='contact'>Contact</h1>");

  Router.map(function() {
    this.resource("about", function() {
      this.route("contact");
    });
  });

  var hidden = 0;

  App.AboutRoute = Ember.Route.extend({
    actions: {
      hide: function() {
        hidden++;
      }
    }
  });

  bootApplication();

  Ember.run(function() {
    router.handleURL("/about");
  });

  Ember.run(function() {
    Ember.$('#about-contact', '#qunit-fixture').click();
  });

  equal(Ember.$("#contact", "#qunit-fixture").text(), "Contact", "precond - the link worked");

  equal(hidden, 0, "The link didn't bubble");
});

test("moves into the named route with context", function() {
  Router.map(function(match) {
    this.route("about");
    this.resource("item", { path: "/item/:id" });
  });

  Ember.TEMPLATES.about = Ember.Handlebars.compile("<h3>List</h3><ul>{{#each controller}}<li>{{#link-to-animated 'item' this animations='main:fade'}}{{name}}{{/link-to-animated}}</li>{{/each}}</ul>{{#link-to-animated 'index' animations='main:fade' id='home-link'}}Home{{/link-to-animated}}");

  var people = {
    yehuda: "Yehuda Katz",
    tom: "Tom Dale",
    erik: "Erik Brynroflsson"
  };

  App.AboutRoute = Ember.Route.extend({
    model: function() {
      return Ember.A([
        { id: "yehuda", name: "Yehuda Katz" },
        { id: "tom", name: "Tom Dale" },
        { id: "erik", name: "Erik Brynroflsson" }
      ]);
    }
  });

  App.ItemRoute = Ember.Route.extend({
    serialize: function(object) {
      return { id: object.id };
    },

    deserialize: function(params) {
      return { id: params.id, name: people[params.id] };
    }
  });

  bootApplication();

  Ember.run(function() {
    router.handleURL("/about");
  });

  equal(Ember.$('h3:contains(List)', '#qunit-fixture').length, 1, "The home template was rendered");
  equal(normalizeUrl(Ember.$('#home-link').attr('href')), '/', "The home link points back at /");

  Ember.run(function() {
    Ember.$('li a:contains(Yehuda)', '#qunit-fixture').click();
  });

  equal(Ember.$('h3:contains(Item)', '#qunit-fixture').length, 1, "The item template was rendered");
  equal(Ember.$('p', '#qunit-fixture').text(), "Yehuda Katz", "The name is correct");

  Ember.run(function() { Ember.$('#home-link').click(); });
  Ember.run(function() { Ember.$('#about-link').click(); });

  equal(normalizeUrl(Ember.$('li a:contains(Yehuda)').attr('href')), "/item/yehuda");
  equal(normalizeUrl(Ember.$('li a:contains(Tom)').attr('href')), "/item/tom");
  equal(normalizeUrl(Ember.$('li a:contains(Erik)').attr('href')), "/item/erik");

  Ember.run(function() {
    Ember.$('li a:contains(Erik)', '#qunit-fixture').click();
  });

  equal(Ember.$('h3:contains(Item)', '#qunit-fixture').length, 1, "The item template was rendered");
  equal(Ember.$('p', '#qunit-fixture').text(), "Erik Brynroflsson", "The name is correct");
});

test("binds some anchor html tag common attributes", function() {
  Ember.TEMPLATES.index = Ember.Handlebars.compile("<h3>Home</h3>{{#link-to-animated 'index' id='self-link' animations='main:fade' title='title-attr'}}Self{{/link-to-animated}}");
  bootApplication();

  Ember.run(function() {
    router.handleURL("/");
  });

  equal(Ember.$('#self-link', '#qunit-fixture').attr('title'), 'title-attr', "The self-link contains title attribute");
});

test("accepts string arguments", function() {
  Router.map(function() {
    this.route('filter', { path: '/filters/:filter' });
  });

  Ember.TEMPLATES.filter = compile('<p>{{filter}}</p>{{#link-to-animated "filter" "unpopular" animations="main:fade" id="link"}}Unpopular{{/link-to-animated}}');
  Ember.TEMPLATES.index = compile('');

  bootApplication();

  Ember.run(function() { router.handleURL("/filters/popular"); });

  equal(Ember.$('#link', '#qunit-fixture').attr('href'), "/filters/unpopular");
});

test("unwraps controllers", function() {
  // The serialize hook is called four times
  expect(4);

  Router.map(function() {
    this.route('filter', { path: '/filters/:filter' });
  });

  var indexObject = { filter: 'popular' };

  App.FilterRoute = Ember.Route.extend({
    model: function(params) {
      return indexObject;
    },

    serialize: function(passedObject) {
      equal(passedObject, indexObject, "The unwrapped object is passed");
      return { filter: 'popular' };
    }
  });

  App.IndexRoute = Ember.Route.extend({
    model: function() {
      return indexObject;
    }
  });

  Ember.TEMPLATES.filter = compile('<p>{{filter}}</p>');
  Ember.TEMPLATES.index = compile('{{#link-to-animated "filter" this id="link" animations="main:fade"}}Filter{{/link-to-animated}}');

  bootApplication();

  Ember.run(function() { router.handleURL("/"); });

  Ember.$('#link', '#qunit-fixture').trigger('click');
});

test("doesn't change view context", function() {
  App.IndexView = Ember.View.extend({
    elementId: 'index',
    name: 'test'
  });

  Ember.TEMPLATES.index = Ember.Handlebars.compile("{{view.name}}-{{#link-to-animated 'index' id='self-link' animations='main:fade'}}Link: {{view.name}}{{/link-to-animated}}");

  bootApplication();

  Ember.run(function() {
    router.handleURL("/");
  });

  equal(Ember.$('#index', '#qunit-fixture').text(), 'test-Link: test', "accesses correct view");
});

test("{{linkToAnimated}} is aliased", function() {
  var originalLinkToAnimated = Ember.Handlebars.helpers['link-to-animated'],
    originalWarn = Ember.warn;

  Ember.warn = function(msg) {
    equal(msg, "The 'linkToAnimated' view helper is deprecated in favor of 'link-to-animated'", 'Warning called');
  };

  Ember.Handlebars.helpers['link-to-animated'] = function() {
    equal(arguments[0], 'foo', 'First arg match');
    equal(arguments[1], 'bar', 'Second arg match');
    return 'result';
  };
  var result = Ember.Handlebars.helpers.linkToAnimated('foo', 'bar');
  equal(result, 'result', 'Result match');

  Ember.Handlebars.helpers['link-to-animated'] = originalLinkToAnimated;
  Ember.warn = originalWarn;
});
