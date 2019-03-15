import React from 'react';

/**
 * Initial Context value, an empty object.
 */
const empty = {};

/**
 * A React Context which holds the translations map.
 */
const MessageSourceContext = React.createContext(empty);
MessageSourceContext.displayName = 'MessageSourceContext';

/**
 * The MessageSourceContext object.
 */
export { MessageSourceContext };

/**
 * Example usage:
 *
 * const translations = await fetch('/api/rest/texts?lang=en');
 * <MessageSource.Provider value={translations}>
 *   <SomeOtherComponent />
 *   ...
 * </MessageSource.Provider>
 */
export const { Provider } = MessageSourceContext;
