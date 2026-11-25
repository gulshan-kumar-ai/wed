import { createContext, useContext } from 'react';

/** Whether the opening doors have been opened yet, and who the invitation is for. */
export const IntroContext = createContext({ opened: true, guest: null });

export const useIntro = () => useContext(IntroContext);
