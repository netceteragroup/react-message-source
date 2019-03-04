# react-message-source

> A library which aids internationalization of React applications

[![NPM](https://img.shields.io/npm/v/react-message-source.svg)](https://www.npmjs.com/package/react-message-source)
[![Build Status](https://travis-ci.org/netceteragroup/react-message-source.svg?branch=master)](https://travis-ci.org/netceteragroup/react-message-source)

# Install

```bash
$ npm install --save react-message-source
or
$ yarn add react-message-source
```

# API
## `Provider`
A `<Proivider />` component which purpose is to provide the translations down the component tree.

##### `value: { [key: string]: string }`
Sets the current translations.

## `FetchingProvider`
A special `<Provider />` which can load translations from remote URL via a `GET` request and pass them down the component tree.

_**Note:** This Provider requires [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) APIs to be available on the `global` object in order to work properly. If you use this library in an older browser environment, please include the required polyfills._

##### `url: string`
An URL where text translations can be found. Whenever this prop changes, a new `GET /props.url` call will be made.

##### `blocking?: boolean`
Controls the rendering flow. When set to `true` it blocks the rendering of the component subtree until translations fetching is complete.
When omitted, it defaults to `true`.

##### `transform?: (response: any) => { [key: string]: string }`
Applies a `transform` on the response received when `GET /props.url` finished. It comes handy in situation when the given `url` doesn't return translations in the expected format.

##### `onFetchingStart?: () => void`
An optional fetching lifecycle method. Invoked just before `GET /props.url` is executed.

##### `onFetchingEnd?: () => void`
An optional fetching lifecycle method. Invoked just after `GET /props.url` response is received.

##### `onFetchingError?: (e?: Error) => void`
An optional fetching lifecycle method. Invoked when error occurs during fetching/processing stage.

## `withMessages`
Creates a higher order component and provides the [ComponentAPI](#ComponentAPI) as `props`. It can be used in two ways:

##### `withMessages(Component)`
Wraps the given `Component` and passes down the [ComponentAPI](#ComponentAPI).

##### `withMessages(keyPrefix?: string)(Component)`
Similar like the example above, but in a curried format. Useful when decorating a `Component` with many higher order components:
```js
compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withMessages,
)(Component)
```
Additionally, the curried form of `withMessages` accepts an optional `keyPefix` which will be prepended before any translation lookup key (see the examples below). This feature comes quite useful when i18n-ing scoped presentational components.

```js
compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withMessages('app.screens.userProfile'), // scoped lookup
)(Component)
```

## `ComponentAPI`
The `ComponentAPI` represent the `props` that a wrapped `Component` will receive once rendered in the tree.

##### `getMessage = (key: string, ...params?: Array<*>) => string`
Will retrieve a translation message specified by the given `key` with all indexed placeholders replaced according to the values given in the `params` array. See the examples below for more information.

##### `getMessageWithNamedParams = (key: string, namedParams?: { [key: string]: any }) => string`
Will retrieve a translation message specified by the given `key` with all named placeholders replaced according to the entries given in the `namedParams` object. See the examples below for more information.

## `propTypes`
Exposes the [ComponentAPI](#ComponentApi) as standard `prop-types` definition.


# Usage examples

#### `translations.json`
```jsx
{
  "hello.world": "Hello World",
  "app.screen.userProfile.greeting": "Welcome {0}",
  "app.screen.userProfile.greeting.parameterized": "Welcome {userName}"
}
```

#### `App.jsx`
```jsx
import React, { Component } from 'react'
import * as MessageSource from 'react-message-source'

import translations from './translations.json'

import MyComponent from './MyComponent'
import MyComponentWithIndexedParams from './MyComponentWithIndexedParams'
import MyComponentWithNamedParams from './MyComponentWithNamedParams'

export default function App() {
  return (
    <MessageSource.Provider value={translations}>
      <MyComponent />
      <MyComponentWithIndexedParams />
      <MyComponentWithNamedParams />
    </MessageSource.Provider>
  )
}
```

#### `FetchApp.jsx`
```jsx
import React, { Component } from 'react'
import * as MessageSource from 'react-message-source'

import translations from './translations.json'

import MyComponent from './MyComponent'
import MyComponentWithIndexedParams from './MyComponentWithIndexedParams'
import MyComponentWithNamedParams from './MyComponentWithNamedParams'

export default function FetchApp() {
  return (
    <MessageSource.FetchingProvider url="http://api.myapp.com/intl?lang=en">
      <MyComponent />
      <MyComponentWithIndexedParams />
      <MyComponentWithNamedParams />
    </MessageSource.FetchingProvider>
  )
}
```

#### `MyComponent.jsx`
```jsx
import React from 'react'
import { withMessages } from 'react-message-source'

function MyComponent(props) {
  const { getMessage } = props;
  return <span>{getMessage('hello.world')}</span>
}

export default withMessages(MyComponent)
```

#### `MyComponentWithIndexedParams.jsx`
```jsx
import React from 'react'
import { withMessages } from 'react-message-source'

function MyComponent(props) {
  const { getMessage } = props;
  return <span>{getMessage('app.screen.userProfile.greeting', 'John Doe')}</span>
}

export default withMessages(MyComponent)
```

#### `MyComponentWithNamedParams.jsx`
```jsx
function MyComponentWithNamedParams(props) {
  const { getMessageWithNamedParams } = props;
  
  // 'app.screen.userProfile' prefix is implicit here
  const greeting = getMessageWithNamedParams('greeting.parameterized', {
    userName: 'John Doe',
  })
  
  return <span>{greeting}</span>
}

export default compose(
  withMessages('app.screen.userProfile'), // scoped keys
)(MyComponentWithNamedParams)
```

## License

MIT © [Netcetera AG](https://github.com/netceteragroup)
