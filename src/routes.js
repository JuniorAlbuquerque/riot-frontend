import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import CreateProject from './pages/CreateProject'
import Dashboard from './pages/Dashboard'

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Dashboard} />
        <Route path="/create-project" component={CreateProject} />
      </Switch>
    </BrowserRouter>
  )
}
