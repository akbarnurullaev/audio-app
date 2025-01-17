/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {SafeAreaProvider} from 'react-native-safe-area-context';

AppRegistry.registerComponent(appName, () => () => <SafeAreaProvider><App/></SafeAreaProvider>);
