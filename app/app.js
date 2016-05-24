// Global variable for RunApp
var App;

// Load the app when the page loads
window.onload = function() {
  App = new RunApp();
}

class RunApp {
  constructor() {
    this.ui = new UI();
    this.data = new Data(this.ui);
    this.init();
  }

  init() {
    var me = this;

    // Initialize databases
    me.data.init().then(function() {

      // Initialize the bits of the UI that should not be active until there's data
      return me.ui.init(me.data);

    }).then(function() {

      // Refresh the display
      me.ui.refresh();

    });
  }
}
