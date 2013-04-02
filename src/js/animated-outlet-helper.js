/**
  Write me...

  Straight-up stolen from `Handlebars.registerHelper('outlet', ...);`

  @method outlet
  @for Ember.Handlebars.helpers
  @param {String} property the property on the controller that holds the view for this outlet
*/
Handlebars.registerHelper('animatedOutlet', function(property, options) {
    var outletSource;

    if (property && property.data && property.data.isRenderData) {
        options = property;
        property = 'main';
    }

    outletSource = options.data.view;
    while (!(outletSource.get('template.isTop'))){
        outletSource = outletSource.get('_parentView');
    }

    options.data.view.set('outletSource', outletSource);
    options.hash.currentViewBinding = '_view.outletSource._outlets.' + property;

    //Only this line has been changed
    return Ember.Handlebars.helpers.view.call(this, Ember.AnimatedContainerView, options);
});
