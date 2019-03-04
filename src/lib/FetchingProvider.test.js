import React from 'react';
import * as RTL from 'react-testing-library';
import { FetchingProvider } from './FetchingProvider';
import { withMessages } from './messageSource';

describe('FetchingProvider', () => {
  const Spy = withMessages(props => props.getMessage('hello.world'));

  beforeEach(() => {
    // mock impl of fetch() API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            'hello.world': 'Hello world',
          }),
      }),
    );
  });

  it('fetches text resources and invokes all lifecycles', async () => {
    const transform = jest.fn(x => x);
    const onFetchingStart = jest.fn();
    const onFetchingEnd = jest.fn();

    function TestComponent() {
      return (
        <FetchingProvider
          url="http://any.uri/texts?lang=en"
          transform={transform}
          onFetchingStart={onFetchingStart}
          onFetchingEnd={onFetchingEnd}
        >
          <Spy />
        </FetchingProvider>
      );
    }

    const { getByText } = RTL.render(<TestComponent />);
    const spyNode = await RTL.waitForElement(() => getByText('Hello world'));

    expect(spyNode).toBeDefined();
    expect(spyNode.innerHTML).toBe('Hello world');
    expect(transform).toHaveBeenCalled();
    expect(onFetchingStart).toHaveBeenCalled();
    expect(onFetchingEnd).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches text resources when url prop changes', async () => {
    function TestComponent(props) {
      return (
        // eslint-disable-next-line react/prop-types
        <FetchingProvider url={props.url}>
          <Spy />
        </FetchingProvider>
      );
    }

    const { getByText, rerender } = RTL.render(<TestComponent url="http://any.uri/texts?lang=en" />);
    await RTL.waitForElement(() => getByText('Hello world'));

    rerender(<TestComponent url="http://any.uri/texts?lang=de" />);

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('invokes onFetchingError lifecycle on network failure', async () => {
    const onFetchingError = jest.fn();
    const faultyFetch = jest.fn(() => Promise.reject(new Error('Failure')));
    global.fetch = faultyFetch;

    RTL.render(<FetchingProvider url="http://any.uri/texts" onFetchingError={onFetchingError} />);
    await RTL.wait(); // until fetch() rejects

    expect(faultyFetch).toHaveBeenCalledTimes(1);
    expect(onFetchingError).toHaveBeenCalledTimes(1);
  });
});
