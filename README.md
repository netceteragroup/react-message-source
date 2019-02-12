# react-message-source

> A library which aids internationalization of React applications

[![NPM](https://img.shields.io/npm/v/react-message-source.svg)](https://www.npmjs.com/package/react-message-source) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-message-source
or
yarn add react-message-source
```

## Usage

```jsx
// translations.json
{
  "hello.world": "Hello World"
}

// in MyComponent.jsx
import React from 'react'
import { withMessages } from 'react-message-source'

function MyComponent(props) {
  const { getMessage } = props;
  return <span>{getMessage('hello.world')}</span>
}

export default withMessages(MyComponent)

// in App.jsx
import React, { Component } from 'react'

import * as MessageSource from 'react-message-source'
import translations from './translations.json'

import MyComponent from './MyComponent'

class App extends Component {
  render () {
    return (
      <MessageSource.Provider value={translations}>
        <MyComponent />
      </MessageSource.Provider>
    )
  }
}
```

## License

MIT © [Netcetera AG](https://github.com/netceteragroup)
