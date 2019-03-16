import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from './MessageSourceContext';

const identity = x => x;

const initialState = {
  translations: {},
  isFetching: false,
};

/**
 * A special <Provider /> which can load translations from remote URL
 * via a `GET` request and pass them down the component tree.
 */
export function FetchingProvider(props) {
  const { url, blocking, children, transform, onFetchingStart, onFetchingEnd, onFetchingError } = props;
  const [{ translations, isFetching }, setState] = React.useState(initialState);

  React.useEffect(() => {
    let isStillMounted = true;

    setState(state => ({ ...state, isFetching: true }));
    onFetchingStart();

    fetch(url)
      .then(r => r.json())
      .then(response => {
        if (isStillMounted) {
          setState({
            translations: transform(response),
            isFetching: false,
          });
          onFetchingEnd();
        }
      })
      .catch(onFetchingError);

    return () => {
      isStillMounted = false;
    };
  }, [url]); // re-fetch only when url changes

  const shouldRenderSubtree = !blocking || (blocking && !isFetching);
  return <Provider value={translations}>{shouldRenderSubtree ? children : null}</Provider>;
}

FetchingProvider.propTypes = {
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

FetchingProvider.defaultProps = {
  blocking: true,
  transform: identity,
  onFetchingStart: identity,
  onFetchingEnd: identity,
  onFetchingError: identity,
};
