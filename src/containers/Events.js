import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Events.css";
import { s3Upload } from "../libs/awsLib";

export default class Events extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      event: null,
      content: "",
      attachmentURL: null,
      isLoading: null,
      isDeleting: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const event = await this.getEvent();
      const { content, attachment } = event;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        event,
        content,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getEvent() {
    return API.get("events", `/events/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w|-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  saveEvent(event) {
    return API.put('events', `/events/${this.props.match.params.id}`, {
      body: event
    });
  }

  handleSubmit = async event => {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a smaller file`);
      return
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      await this.saveEvent({
        content: this.state.content,
        attachment: attachment || this.state.content.attachment
      });
      this.props.history.push("/");
    } catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteEvent() {
    return API.del('events', `/events/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this event?");

    if(!confirmed) { return; }

    this.setState({ isDeleting: true });

    try {
      await this.deleteEvent();
      this.props.history.push("/");
    } catch(e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Events">
        {this.state.event && 
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          {this.state.event.attachment && 
          <FormGroup controlId="file">
            <ControlLabel>Attachement</ControlLabel>
            <FormControl.Static>
              <a target="_blank"
                  rel="noopener noreferrer"
                  href={this.state.attachmentURL}
              >{this.formatFilename(this.state.event.attachment)}</a>
            </FormControl.Static>
          </FormGroup>}
          {!this.state.event.attachment &&
            <ControlLabel>Attachement</ControlLabel>}
          <FormControl onChange={this.handleFileChange} type="file"/>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Save"
            loadingText="Saving..."
          />
          <LoaderButton
            block
            bsStyle="danger"
            bsSize="large"
            isLoading={this.state.isDeleting}
            onClick={this.handleDelete}
            text="Delete"
            loadingText="Deleting..."
          />
        </form>}
      </div>
    );
  }
}