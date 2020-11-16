import * as React from 'react';
import { MessageSourceContextShape, Provider } from './MessageSourceContext';

const identity = (x: any): any => x;
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
   * Note that the previous translations or an empty translation map will be used in case translations fails by default.
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
    transform = identity,
    onFetchingStart = noop,
    onFetchingEnd = noop,
    onFetchingError = noop,
  } = props;

  const [{ translations, isFetched }, setState] = React.useState<State>(initialState);

  React.useEffect(() => {
    let isStillMounted = true;

    setState((state: State) => ({ ...state, isFetched: false }));
    onFetchingStart();

    fetch(url)
      .then(r => r.json())
      .then(response => {
        if (isStillMounted) {
          setState(prevState => ({
            translations: transform(response) || prevState.translations,
            isFetched: true,
          }));
          onFetchingEnd();
        }
      })
      .catch(e => {
        onFetchingError(e);
        setState(prevState => ({ ...prevState, isFetched: true }));
      });

    return () => {
      isStillMounted = false;
    };
  }, [url]); // re-fetch only when url changes

  const shouldRenderSubtree = !blocking || (blocking && isFetched);
  return <Provider value={translations}>{shouldRenderSubtree ? children : null}</Provider>;
}
