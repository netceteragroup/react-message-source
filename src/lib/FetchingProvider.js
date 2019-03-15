import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Provider } from './MessageSourceContext';

const identity = x => x;

export class FetchingProvider extends Component {
  state = {
    translations: {},
    fetching: false,
  };

  mounted = false;

  static propTypes = {
    /**
     * The URL which serves the text messages.
     * Required.
     */
    url: PropTypes.string.isRequired,

    /**
     * Makes the rendering of the sub-tree synchronous.
     * The components will not render until fetching of the text messages finish.
     *
     * Defaults to true.
     */
    blocking: PropTypes.bool,

    /**
     * A function which can transform the response received from GET /props.url
     * to a suitable format:
     *
     * Example:
     * function transform(response) {
     *   return response.textMessages;
     * }
     */
    transform: PropTypes.func,

    /**
     * Invoked when fetching of text messages starts.
     */
    onFetchingStart: PropTypes.func,

    /**
     * Invoked when fetching of text messages finishes.
     */
    onFetchingEnd: PropTypes.func,

    /**
     * Invoked when fetching fails.
     */
    onFetchingError: PropTypes.func,

    /**
     * Children.
     */
    children: PropTypes.node,
  };

  static defaultProps = {
    blocking: true,
    transform: identity,
    onFetchingStart: identity,
    onFetchingEnd: identity,
    onFetchingError: identity,
  };

  componentDidMount() {
    this.mounted = true;
    this.fetchResources();
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.fetchResources();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchResources = () => {
    const { url, transform, onFetchingStart, onFetchingEnd, onFetchingError } = this.props;

    this.setState({ fetching: true }, onFetchingStart);
    fetch(url)
      .then(r => r.json())
      .then(response => {
        if (this.mounted) {
          this.setState(
            {
              translations: transform(response),
              fetching: false,
            },
            onFetchingEnd,
          );
        }
      })
      .catch(onFetchingError);
  };

  render() {
    const { blocking, children } = this.props;
    const { translations, fetching } = this.state;
    const shouldRenderSubtree = !blocking || (blocking && !fetching);
    return <Provider value={translations}>{shouldRenderSubtree ? children : null}</Provider>;
  }
}
