/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import './src/shared/theme/unistyles';
import App from './src/app/App';
import {playbackService} from './src/services/player/playbackService';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
