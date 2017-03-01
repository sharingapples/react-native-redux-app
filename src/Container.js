import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

function extractComponent(path, routes) {
  const name = path[0];
  if (name && routes.paths[name]) {
    return routes.paths[name].index;
  }
  return routes.index;
}

class Container extends Component {
  static contextTypes = {
    path: PropTypes.arrayOf(PropTypes.string).isRequired,
    routes: PropTypes.shape({
      index: PropTypes.func,
      paths: PropTypes.shape(),
    }).isRequired,
  };

  static childContextTypes = {
    path: PropTypes.arrayOf(PropTypes.string).isRequired,
    routes: PropTypes.shape({
      index: PropTypes.func,
      paths: PropTypes.shape(),
    }).isRequired,
    registerContainer: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      path: context.path,
      routes: context.routes,
      ChildComponent: extractComponent(context.path, context.routes),
    };
  }

  getChildContext() {
    const path = this.state.path.slice();
    const paths = this.state.routes.paths;

    const name = path.shift();
    const routes = name && paths[name] ? paths[name] : { index: null, paths: null };

    return {
      registerContainer: (container) => {
        this.container = container;
        return () => {
          this.container = null;
        };
      },
      path,
      routes,
    };
  }

  componentWillMount() {
    // Register the container to display the child components
    if (this.context.registerContainer) {
      this.unregister = this.context.registerContainer(this);
    }
  }

  componentWillUnmount() {
    if (this.unregister) {
      this.unregister();
      this.unregister = null;
    }
  }

  process(path, routes) {
    const V = extractComponent(path, routes);
    const childPath = path.slice();
    const name = childPath.shift();
    const childRoutes = name && routes.paths[name]
            ? routes.paths[name]
            : { index: null, paths: null };

    const oldContainer = this.container;
    this.setState({
      path,
      routes,
      ChildComponent: V,
    }, () => {
      if (this.container && childRoutes && this.container === oldContainer) {
        this.container.process(childPath, childRoutes);
      }
    });
  }

  render() {
    const { ChildComponent } = this.state;

    return (
      <View {...this.props} style={{ flex: 1, flexDirection: 'row' }}>
        { ChildComponent && <ChildComponent /> }
      </View>
    );
  }
}

export default Container;
