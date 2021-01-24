import { AppRegistry } from 'react-native'
import { App } from './App.tsx'
import { name as appName } from './app.json'

let app = App
AppRegistry.registerComponent(appName, () => app)
