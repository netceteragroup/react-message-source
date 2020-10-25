import * as React from 'react';
import { MessageSourceContextShape, Provider } from './MessageSourceContext';

const identityWithFalsenessCheck = (x: any) => (!!x ? x : {});
const noop = () => {};

export interface FetchingProviderApi {
  /**
   * The URL which serves the text messages.
   */
  url: string;

  /**
   * Makes the rendering of the sub-tree synchronous.
   * The components will not render until fetching of the text messages finish.
   */
  blocking?: boolean;

  /**
   * A function which can transform the response received from GET /props.url
   * to a suitable format:
   *
   * Example:
   * function transform(response) {
   *   return response.textMessages;
   * }
   */
  transform?: (x: any) => MessageSourceContextShape;

  /**
   * Invoked when fetching of text messages starts.
   */
  onFetchingStart?: () => void;

  /**
   * Invoked when fetching of text messages finishes.
   */
  onFetchingEnd?: () => void;

  /**
   * Invoked when fetching fails.
   */
  onFetchingError?: (e: Error) => void;

  /**
   * Children.
   */
  children: React.ReactNode;
}

type State = {
  translations: MessageSourceContextShape,
  isFetched: boolean,
};

const initialState: State = {
  translations: {},
  isFetched: false,
};

/**
 * A special <Provider /> which can load translations from remote URL
 * via a `GET` request and pass them down the component tree.
 */
export function FetchingProvider(props: FetchingProviderApi) {
  const {
    url,
    children,
    blocking = true,
    transform = identityWithFalsenessCheck,
    onFetchingStart = noop,
    onFetchingEnd = noop,
    onFetchingError = noop,
  } = props;

  const [{ translations, isFetched }, setState] = React.useState<State>(initialState);

  React.useEffect(() => {
    let isStillMounted = true;
    const defaultOnFetchingError = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Failed to fetch translations. Setting an empty translation map.');
      }
      setState({ translations: {}, isFetched: true });
    };

    setState((state: State) => ({ ...state, isFetched: false }));
    onFetchingStart();

    fetch(url)
      .then(r => r.json())
      .then(response => {
        if (isStillMounted) {
          setState({
            translations: transform(response),
            isFetched: true,
          });
          onFetchingEnd();
        }
      })
      .catch(e => (onFetchingError !== noop ? onFetchingError(e) : defaultOnFetchingError()));

    return () => {
      isStillMounted = false;
    };
  }, [url]); // re-fetch only when url changes

  const shouldRenderSubtree = !blocking || (blocking && isFetched);
  return <Provider value={translations}>{shouldRenderSubtree ? children : null}</Provider>;
}
