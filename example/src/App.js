import React from 'react';
import * as MessageSource from 'react-message-source';

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

      <MessageSource.Provider value={translations}>
        <LocalizedLabel />

        <LocalizedLabelCurried />

        <PrefixedLocalizedLabel />

        <LocalizedLabelWithNamedParams />
      </MessageSource.Provider>
    </React.Fragment>
  );
}
