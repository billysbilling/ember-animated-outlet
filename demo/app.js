App = Ember.Application.create();


App.Router.reopen({
    location: 'history'
});
App.Router.map(function() {
    this.resource('invoices', function() {
        this.route('show', {path: '/:invoice_id'});
    });
    this.resource('contacts', function() {
        this.resource('contact', {path: '/:contact_id'}, function() {
            this.route('info');
            this.route('invoices');
        });
    });
});


App.ApplicationRoute = Ember.Route.extend({
    events: {
        goToIndex: function() {
            this.transitionToAnimated('index', {main: 'fade'});
        },
        goToInvoices: function() {
            this.transitionToAnimated('invoices', {main: 'fade'});
        },
        showInvoice: function(invoice) {
            this.transitionToAnimated('invoices.show', {main: 'slideLeft'}, invoice);
        },
        goToContacts: function() {
            this.transitionToAnimated('contacts', {main: 'fade'});
        },
        goToExampleContact: function() {
            this.transitionToAnimated('contact.info', {main: 'slideLeft'}, App.Contact.find(201));
        },
        showContact: function(contact) {
            this.transitionToAnimated('contact.info', {main: 'slideLeft'}, contact);
        },
        showContactInfo: function() {
            this.replaceWithAnimated('contact.info', {contact: 'flip'});
        },
        showContactInvoices: function() {
            this.replaceWithAnimated('contact.invoices', {contact: 'flip'});
        },
        goBack: function() {
            Ember.AnimatedOutletView.enqueueAnimations({main: 'slideRight'});
            window.history.go(-1);
        }
    }
});
App.ApplicationView = Ember.View.extend({
    classNames: ['application']
});

App.IndexView = Ember.View.extend();

App.InvoicesIndexRoute = Ember.Route.extend({
    model: function() {
        return App.Invoice.find();
    }
});
App.InvoicesIndexView = Ember.View.extend();
App.InvoicesShowView = Ember.View.extend();


App.ContactsIndexRoute = Ember.Route.extend({
    model: function() {
        return App.Contact.find();
    }
});
App.ContactsIndexView = Ember.View.extend();
App.ContactView = Ember.View.extend();
App.ContactInfoRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('contact');
    }
});
App.ContactInfoController = Ember.ObjectController.extend({
    formattedAddress: function() {
        return new Ember.Handlebars.SafeString(Ember.Handlebars.Utils.escapeExpression(this.get('address')).replace(/\n/g, '<br>'));
    }.property('address')
});
App.ContactInfoView = Ember.View.extend({
    classNames: ['panel-inner']
});
App.ContactInvoicesRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('contact');
    }
});
App.ContactInvoicesView = Ember.View.extend({
    classNames: ['panel-inner']
});


App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
})

App.Invoice = DS.Model.extend({
    contact: DS.belongsTo('App.Contact'),
    no: DS.attr('number'),
    amount: DS.attr('amount')
});

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    address: DS.attr('string'),
    invoices: DS.hasMany('App.Invoice')
});

App.Invoice.FIXTURES = [
    {
        id: 101,
        contact: 201,
        no: 1,
        amount: 198
    },
    {
        id: 102,
        contact: 202,
        no: 2,
        amount: 209
    },
    {
        id: 103,
        contact: 201,
        no: 3,
        amount: 734
    }
];

App.Contact.FIXTURES = [
    {
        id: 201,
        name: 'Chocolate Fever',
        address: '680 Choco Avenue\n94105 San Francisco, CA\nUnited States',
        invoices: [101, 103]
    },
    {
        id: 202,
        name: 'Ice Cream and Fun',
        address: '750 Icey Road\n94105 San Francisco, CA\nUnited States',
        invoices: [102]
    }
];