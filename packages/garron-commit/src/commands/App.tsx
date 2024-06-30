import { memo } from 'react';

import Ai from './Ai';
import Commit from './Commit';
import Config from './Config';
import HookCreate from './Hook/HookCreate';
import HookRemove from './Hook/HookRemove';
import List from './List';

export interface AppProps {
  ai: boolean;
  commit: boolean;
  config: boolean;
  help: boolean;
  hook: boolean;
  init: boolean;
  list: boolean;
  remove: boolean;
  update: boolean;
  version: boolean;
}

const App = memo<AppProps>((props) => {
  if (props.list) {
    return <List />;
  } else if (props.commit) {
    return <Commit />;
  } else if (props.config) {
    return <Config />;
  } else if (props.init) {
    return <HookCreate />;
  } else if (props.remove) {
    return <HookRemove />;
  } else if (props.version) {
    return false;
  } else if (props.hook) {
    return <Commit hook />;
  } else if (props.ai) {
    return <Ai />;
  }
  return <Commit />;
});

export default App;
