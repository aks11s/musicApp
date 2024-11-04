import {UnistylesRegistry} from 'react-native-unistyles';
import {breakpoints} from './breakpoints';
import {darkTheme, lightTheme} from './themes';

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

UnistylesRegistry.addThemes({
  light: lightTheme,
  dark: darkTheme,
})
  .addBreakpoints(breakpoints)
  .addConfig({adaptiveThemes: true});
