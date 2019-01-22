import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { API } from  "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewEvent.css";
import { s3Upload } from "../libs/awsLib";


export default class NewEvent extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: ""
    };
  }

  createEvent(event) {
    return API.post("events", "/events", {
      body: event
    });
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file > config.MAX_ATTACHMENT_SIZE){
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file
      ? await s3Upload(this.file)
      : null;

      await this.createEvent({ 
        attachment,
        content: this.state.content 
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
    }
  }


  render() {
    return (
      <div className="NewEvent">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachement</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>

          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating..."
          />
        </form>
      </div>
    )
  }
}