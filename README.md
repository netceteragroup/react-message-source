# react-message-source

> A library which aids internationalization of React applications

[![NPM](https://img.shields.io/npm/v/react-message-source.svg)](https://www.npmjs.com/package/react-message-source)

## Install

```bash
$ npm install --save react-message-source
or
$ yarn add react-message-source
```

## Usage examples

```jsx
// translations.json
{
  "hello.world": "Hello World",
  "userProfile.greeting": "Welcome {0}"
  "userProfile.greeting.parameterized"
}

// in MyComponent.jsx
import React from 'react'
import { withMessages } from 'react-message-source'

function MyComponent(props) {
  const { getMessage } = props;
  return <span>{getMessage('hello.world')}</span>
}

// the standard scenario
export default withMessages(MyComponent)

// in MyOtherComponent.jsx
function MyOtherComponent(props) {
 const { getMessage } = props;
 return <span>{getMessage('hello.world')}</span>
}

// sometimes you might like to scope the text keys and avoid repeating the common key segments
// in that case, you can use the curried version
export default compose(
  withMessages('hello'),
)(MyOtherComponent)

// in App.jsx
import React, { Component } from 'react'
import * as MessageSource from 'react-message-source'

import translations from './translations.json'

import MyComponent from './MyComponent'
import MyOtherComponent from './MyOtherComponent'

class App extends Component {
  render () {
    return (
      <MessageSource.Provider value={translations}>
        <MyComponent />
        <MyOtherComponent />
      </MessageSource.Provider>
    )
  }
}

## License

MIT © [Netcetera AG](https://github.com/netceteragroup)
