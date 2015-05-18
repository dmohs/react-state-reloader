/**
 * ReactStateReloader v0.1
 */
(function() {

  function isEmpty(obj) {
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) return false;
    }
    return true;
  }

  function getStateHierarchy(componentInstance) {
    if (!componentInstance) return {};
    var state = componentInstance.state || null;
    var renderedComponent = componentInstance._renderedComponent;
    var children = renderedComponent ? (renderedComponent._renderedChildren || null) : null;
    var childHierarchies = {};
    if (children) {
      for (var k in children) {
        if (children.hasOwnProperty(k)) {
          var childHierarchy = getStateHierarchy(children[k]);
          if (!isEmpty(childHierarchy)) {
            childHierarchies[k] = childHierarchy;
          }
        }
      }
    }
    var result = {};
    if (state) result.state = state;
    if (!isEmpty(childHierarchies)) result.children = childHierarchies;
    return result;
  }

  function withPrevStateHierarchy(componentInstance, props) {
    var newProps = {prevStateHierarchy: getStateHierarchy(componentInstance)};
    for (var k in props) {
      if (props.hasOwnProperty(k)) {
        newProps[k] = props[k];
      }
    }
    return newProps;
  }

  function getCompPrevStateHierarchy() {
    var prevStateHierarchy = this.props.prevStateHierarchy;
    if (prevStateHierarchy) {
      if (this._mountDepth == 0) {
        return prevStateHierarchy;
      } else {
        var mountIndex = this._rootNodeID.split('.').slice(-1)[0];
        var thisHierarchy = prevStateHierarchy['.' + mountIndex];
        return thisHierarchy;
      }
    }
    return {};
  }
  
  function getCompPreviousRenderState(defaultState) {
    return this.getPrevStateHierarchy().state || defaultState;
  }

  function withCompPrevStateHierarchy(props) {
    var prevStateHierarchy = this.getPrevStateHierarchy();
    if (prevStateHierarchy && prevStateHierarchy.children) {
      var newProps = {};
      for (var k in props) {
        if (props.hasOwnProperty(k)) {
          newProps[k] = props[k];
        }
      }
      newProps.prevStateHierarchy = prevStateHierarchy.children;
      return newProps;
    }
    return props;
  }

  var ComponentMixin = {
    getPrevStateHierarchy: getCompPrevStateHierarchy,
    getPreviousRenderState: getCompPreviousRenderState,
    withPrevStateHierarchy: withCompPrevStateHierarchy
  };

  var M = {
    getStateHierarchy: getStateHierarchy,
    withPrevStateHierarchy: withPrevStateHierarchy,
    ComponentMixin: ComponentMixin
  };
  
  window.ReactStateReloader = M;
})();
