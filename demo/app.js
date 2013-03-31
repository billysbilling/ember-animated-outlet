App = Ember.Application.create();


App.Router.map(function() {
    this.route('invoices');
    this.route('invoicesShow', {path: 'invoices/:invoice_id'})
    this.route('bills');
    this.route('billsShow', {path: 'bills/:bill_id'});
    this.route('contacts');
    this.route('contactsShow', {path: 'contacts/:contact_id'});
});


App.ApplicationRoute = Ember.Route.extend({
    events: {
        goToIndex: function() {
            this.transitionToAnimated('index', null, {main: 'flip'});
        },
        goToInvoices: function() {
            this.transitionToAnimated('invoices', null, {main: 'flip'});
        },
        showInvoice: function(invoice) {
            this.transitionTo('invoicesShow', invoice);
        },
        goToBills: function() {
            this.transitionTo('bills');
        },
        showBill: function(bill) {
            this.transitionToAnimated('billsShow', bill, {main: 'slideLeft'});
        },
        goToContacts: function() {
            this.transitionTo('contacts');
        },
        showContact: function(contact) {
            this.transitionTo('contactsShow', contact);
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


App.InvoicesRoute = Ember.Route.extend({
    model: function() {
        return App.Invoice.find();
    }
});


App.BillsRoute = Ember.Route.extend({
    model: function() {
        return App.Bill.find();
    }
});


App.ContactsRoute = Ember.Route.extend({
    model: function() {
        return App.Contact.find();
    }
});


App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
})

App.Invoice = DS.Model.extend({
    contact: DS.belongsTo('App.Contact'),
    no: DS.attr('number')
});

App.Bill = DS.Model.extend({
    contact: DS.belongsTo('App.Contact'),
    description: DS.attr('string')
});

App.Contact = DS.Model.extend({
    name: DS.attr('string'),
    invoices: DS.hasMany('App.Invoice'),
    bills: DS.hasMany('App.Bill')
});

App.Invoice.FIXTURES = [
    {
        id: 101,
        contact: 301,
        no: 1
    },
    {
        id: 102,
        contact: 302,
        no: 2
    },
    {
        id: 103,
        contact: 301,
        no: 3
    }
];

App.Bill.FIXTURES = [
    {
        id: 201,
        contact: 302,
        description: 'Strawberry ice cream'
    },
    {
        id: 202,
        contact: 301,
        description: '10 lbs chocolate'
    },
    {
        id: 203,
        contact: 301,
        description: 'Tasty sherbet'
    }
];

App.Contact.FIXTURES = [
    {
        id: 301,
        name: 'Chocolate Fever',
        invoices: [101, 103],
        bills: [202, 203]
    },
    {
        id: 302,
        name: 'Ice Cream and Fun',
        invoices: [102],
        bills: [201]
    }
];