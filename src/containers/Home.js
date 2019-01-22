import React, { Component } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import './Home.css';
import { API } from 'aws-amplify';
import { LinkContainer } from "react-router-bootstrap";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      events: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const events = await this.events();
      this.setState({ events });
    } catch(e) {
      alert(e);
    }

    this.setState({ isLoading: false })
  }

  events() {
    return API.get('events', '/events');
  }


  renderEventsList(events) {
    return [{}].concat(events).map(
      (event, i) =>
        i !== 0
          ? <LinkContainer
              key={event.eventId}
              to={`/events/${event.eventId}`}
            >
              <ListGroupItem header={event.content.trim().split("\n")[0]}>
                {"Created: " + new Date(event.createdAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/events/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new event
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderLander() {
    return(
      <div className="lander">
          <h1>Events</h1>  
          <p>A simple event management app</p>
        </div>
    );
  }

  renderEvents() {
    return (
      <div className="events">
        <PageHeader>Your Events</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderEventsList(this.state.events)}
        </ListGroup>
      </div>
    )
  }

  render() {
    return(
      <div className="Home">
        {this.props.isAuthenticated ? this.renderEvents() : this.renderLander() }
      </div>
    );
  }
}