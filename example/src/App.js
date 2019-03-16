import React from 'react';
import { Provider as MessageSourceProvider } from 'react-message-source';

import Hooks from './Hooks';
import {
  LocalizedLabel,
  LocalizedLabelCurried,
  PrefixedLocalizedLabel,
  LocalizedLabelWithNamedParams,
} from './Greeting';

const translations = {
  'hello.world': 'Hello world',
  'greeting.with.name': 'Hello Mr. {name}',
};

export default function App() {
  return (
    <React.Fragment>
      <p>The content below is localized, see Greeting.js for more information.</p>

      <MessageSourceProvider value={translations}>
        <LocalizedLabel />
        <LocalizedLabelCurried />
        <PrefixedLocalizedLabel />
        <LocalizedLabelWithNamedParams />
        <Hooks />
      </MessageSourceProvider>
    </React.Fragment>
  );
}
