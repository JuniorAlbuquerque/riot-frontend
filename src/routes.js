import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import CreateProject from './pages/CreateProject'
import Dashboard from './pages/Dashboard'
import Project from './pages/ProjectInfo'
import SubSystem from './pages/SubInfo'
import Profile from './pages/ProgilePage';
import Help from './pages/Help';

import { isAuthenticated } from './auth';

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route 
      {...rest}
      render = { props => (isAuthenticated()) ? (<Component {...props} />) : (<Redirect to={{pathname: '/', state: { from: props.location }}} />) } 
    />
) 

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/home" component={Dashboard}/>
        <PrivateRoute path="/profile/:id_user" component={Profile} />
        <PrivateRoute path="/create-project" component={CreateProject} />
        <PrivateRoute path="/project/:id_project" component={Project} />
        <PrivateRoute path="/subsystem/:id_sub/:id_project" component={SubSystem} />
        <PrivateRoute path="/help" component={Help}/>
      </Switch>
    </BrowserRouter>
  )
}
