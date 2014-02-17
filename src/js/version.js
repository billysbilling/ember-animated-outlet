(function(){
  var VERSION = '{{ VERSION }}';
  
  if (Ember.libraries) {
    Ember.libraries.register('Ember Animated Outlet', VERSION);
  }
})();