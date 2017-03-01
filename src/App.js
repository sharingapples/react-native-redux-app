import React, { Component, PropTypes } from 'react';
import Container from './Container';

class App extends Component {
  static propTypes = {
    routes: PropTypes.shape({
      index: PropTypes.func,
      routes: PropTypes.shape(),
    }).isRequired,
    initialPath: PropTypes.string.isRequired,
  };

  static childContextTypes = {
    path: PropTypes.arrayOf(PropTypes.string).isRequired,
    routes: PropTypes.shape({
      index: PropTypes.func,
      routes: PropTypes.shape(),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.container = null;
    this.currentPath = props.initialPath;
  }

  getChildContext() {
    const path = this.currentPath.split('/');
    path.shift();

    return {
      path,
      routes: this.props.routes,
    };
  }

  linkTo(path) {
    // Only do anything if the path changes
    if (this.currentPath === path) {
      return;
    }

    this.currentPath = path;
    const parts = path.split('/').shift();
    this.container.process(parts, this.props.routes);
  }

  render() {
    return (
      <Container
        ref={(node) => { this.container = node; }}
      />
    );
  }
}

export default App;
