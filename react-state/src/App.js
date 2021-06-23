import Main from './Main';
import Main2 from './Main2';

import { QueryClient, QueryClientProvider } from 'react-query';

import { ReactQueryDevtools } from 'react-query/devtools';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function Routers() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/context" exact component={Main2} />
      </Switch>
    </Router>
  );
}
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <Routers />
    </QueryClientProvider>
  );
}

export default App;
