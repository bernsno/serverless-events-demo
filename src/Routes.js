import React from 'react';
import { Route, Switch} from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewEvent from './containers/NewEvent';
import AppliedRoute from './components/AppliedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Events from './containers/Events';

export default ({ childProps }) =>
 <Switch>
   <AppliedRoute path="/" exact component={Home} props={childProps} />
   <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
   <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
   <AuthenticatedRoute path="/events/new" exact component={NewEvent} props={childProps} />
   <AuthenticatedRoute path="/events/:id" exact component={Events} props={childProps} />
   <Route component={NotFound} />
 </Switch>;