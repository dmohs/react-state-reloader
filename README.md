# react-state-reloader
A React tool that helps preserve state when re-rendering.

### Usage:
```javascript
window.app = React.render(
  React.createElement(MyApp, {}),
    document.body
  );

// Pretend this setInterval is getting called
// after the definitions have been reloaded.
setInterval(
  function() {
    window.app = React.render(
      React.createElement(
        MyApp,
        ReactStateReloader.withPrevStateHierarchy(window.app, {})
      ),
      document.body
    )
  },
  1000
);

var MyComponent = React.createClass({
  mixins: [ReactStateReloader.ComponentMixin],
  getInitialState: function() {
    return this.getPreviousRenderState({myValue: 4});
  },
  render: function() {
    return React.DOM.div(
      {},
      React.createElement(
        MyOtherComponent,
        this.withPrevStateHierarchy({color: 'blue'})
      )
    );
  }
});
```