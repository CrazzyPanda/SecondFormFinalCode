import React from 'react';
import axios from 'axios';
import * as selectData from '../data.json';
import {Container, Row, Col, Card, Button, ProgressBar, Alert} from 'react-bootstrap/'
import {Checkbox, FormHelperText} from '@material-ui/core/';
import validate from '../components/Validate';
import Address from '../components/Address';
import Aboutyou from '../components/Aboutyou';
import Property from '../components/Property';
import Cover from '../components/Cover';
import Oldcover from '../components/Oldcover';


class Home extends React.Component{

  constructor(props) {
    super(props);
    this.aboutYouControls = null;
    this.setAboutYouControls = e => {
      this.aboutYouControls = e;
    }

    this.state = selectData.default;
  }

  handleInputChange = e => { //Handles input change and sets state to the value in the input
      
    const target = e.target;
    const value =  target.type === 'checkbox' ? target.checked : target.value;
    var name = target.name;
    
    console.log(`Input name ${name}. Input value ${value}.`);

    //Validation code
    var objName, propertyName;
    // 'aboutYouControls.first_name'
    var names = name.split('.');
    objName = names[0]; // 'aboutYouControls' this.state.aboutYouControls
    propertyName = names[1] // 'first_name' this.state.aboutYouControls.first_name
  

    const updatedControls = this.state[objName];
    const updatedFormElement = updatedControls[propertyName];
    updatedFormElement.value = value;
    updatedFormElement.touched = true;
    // updatedFormElement.valid = validate(value, updatedFormElement.validationRules, propertyName);
    updatedFormElement.valid = validate(value, updatedFormElement.validationRules, name)[0];

    updatedControls[propertyName] = updatedFormElement;
    this.isSubmitValid();
    this.setState(this.state);
  }

  isSubmitValid(){ //Disables submit button until all the required inputs are filled without errors
    console.log("isSubmitValid");
    var isError = false;

    for (let formSection in this.state) {
      for(let formElement in this.state[formSection]){
        console.log("formSection", typeof formSection);
        let value = this.state[formSection][formElement].value;
        let rules = this.state[formSection][formElement].validationRules;
        if(this.state[formSection][formElement].valid.toString() === "false"){
          if(!validate(value, rules, formElement)[0]){
            console.log("Validate failed", value, rules, formElement );
            isError = true;
          }
        }
        
      }
    }
    console.log("isError", isError);
    if(isError){
      document.getElementById('errorTextBottom').innerHTML = "Please check the form for errors or missed questions before you continue";
      document.getElementById('submitButton').disabled = true;
    }else{
      document.getElementById('errorTextBottom').innerHTML = "";
      document.getElementById('submitButton').disabled = false;
    }
    this.setState(this.state);
  }

  onSubmit = e => { //invoked when 'get quote' button is clicked
    console.log("onSubmit");
    e.preventDefault();
  
    const customer = { //creates new customer object
      title: this.state["aboutYouControls"]["title"].value,
      first_name: this.state["aboutYouControls"]["first_name"].value,
      last_name: this.state["aboutYouControls"]["last_name"].value,
      gender: this.state["aboutYouControls"]["gender"].value,
      date_of_birth: this.state["aboutYouControls"]["date_of_birth"].value,
      marital_status: this.state["aboutYouControls"]["marital_status"].value,
      employment_status: this.state["aboutYouControls"]["employment_status"].value,
      occupation: this.state["aboutYouControls"]["occupation"].value,
      telephone: this.state["aboutYouControls"]["telephone"].value,
      email: this.state["aboutYouControls"]["email"].value,
      first_buyer: this.state["aboutYouControls"]["first_buyer"].value,
      motor_convic: this.state["aboutYouControls"]["motor_convic"].value,

      address: this.state["addressControls"]["address"].value,
      address_results: this.state["addressControls"]["address_results"].value,
      alter_address: this.state["addressControls"]["alter_address"].value,
      address_line_1: this.state["addressControls"]["address_line_1"].value,
      address_line_2: this.state["addressControls"]["address_line_2"].value,
      town: this.state["addressControls"]["town"].value,
      county: this.state["addressControls"]["county"].value,

      own_prop: this.state["propertyControls"]["own_prop"].value,
      lives_in_prop: this.state["propertyControls"]["lives_in_prop"].value,
      holiday_home: this.state["propertyControls"]["holiday_home"].value,
      property_type: this.state["propertyControls"]["property_type"].value,
      year_built: this.state["propertyControls"]["year_built"].value,
      bedrooms: this.state["propertyControls"]["bedrooms"].value,
      bathrooms: this.state["propertyControls"]["bathrooms"].value,
      heating: this.state["propertyControls"]["heating"].value,
      burgler_alarm: this.state["propertyControls"]["burgler_alarm"].value,
      smoke_alarm: this.state["propertyControls"]["smoke_alarm"].value,
      security_locks: this.state["propertyControls"]["security_locks"].value,
      basement: this.state["propertyControls"]["basement"].value,
      roof_type: this.state["propertyControls"]["roof_type"].value,
      roof_material: this.state["propertyControls"]["roof_material"].value,
      extension: this.state["propertyControls"]["extension"].value,
      ex_roof_type: this.state["propertyControls"]["ex_roof_type"].value,
      ex_roof_material: this.state["propertyControls"]["ex_roof_material"].value,
      occupied: this.state["propertyControls"]["occupied"].value,
      smokers: this.state["propertyControls"]["smokers"].value,
      subsidence: this.state["propertyControls"]["subsidence"].value,
      flooding: this.state["propertyControls"]["flooding"].value,
      neighbour: this.state["propertyControls"]["neighbour"].value,

      policy_start: this.state["coverControls"]["policy_start"].value,
      build_cover: this.state["coverControls"]["build_cover"].value,
      con_cover: this.state["coverControls"]["con_cover"].value,
      vol_excess: this.state["coverControls"]["vol_excess"].value,
      acc_damage: this.state["coverControls"]["acc_damage"].value,
      pre_insured: this.state["coverControls"]["pre_insured"].value,

      policy_end: this.state["oldCoverControls"]["policy_end"].value,
      pre_insurance: this.state["oldCoverControls"]["pre_insurance"].value,
      policy_num: this.state["oldCoverControls"]["policy_num"].value,
      years_pre_insurer: this.state["oldCoverControls"]["years_pre_insurer"].value,
      no_claims: this.state["oldCoverControls"]["no_claims"].value,

      privacy_policy: this.state["termsControls"]["privacy_policy"].value,
      offers: this.state["termsControls"]["offers"].value,
      terms: this.state["termsControls"]["terms"].value
    }
    console.log(customer);

    axios.post('http://localhost:4000/customers', customer) //posts customer object to back-end
      .then(res => console.log(res.data))
      .catch(err => console.log("ERROR " + err));
  }


  formSubmitHandler(e){
    e.preventDefault();
    
    this.setState(this.state);
  }

  render(){

    return(
      <>
        {/* Passing onSubmit, handleInputChange and state to child components */}
        <Aboutyou onSubmit={this.onSubmit}
          handleInputChange={this.handleInputChange}
          controls={this.state.aboutYouControls}
          ref={this.setAboutYouControls} 
        />
        <Container>
          <ProgressBar className="progressMargin" now={20} label="20% Done"/>
        </Container>
        <Address 
          onSubmit={this.onSubmit} 
          handleInputChange={this.handleInputChange} 
          controls={this.state.addressControls} 
          ref={this.addressControls}
        />
        <Container>
          <ProgressBar className="progressMargin" now={40} label="40% Done"/>
        </Container>
        <Property onSubmit={this.onSubmit} 
          handleInputChange={this.handleInputChange} 
          controls={this.state.propertyControls} 
          ref={this.propertyControls}
        />
        <Container>
          <ProgressBar className="progressMargin" now={60} label="60% Done"/>
        </Container>
        <Cover onSubmit={this.onSubmit} 
          handleInputChange={this.handleInputChange} 
          controls={this.state.coverControls} 
          ref={this.coverControls}
        />
        <Container>
          <ProgressBar className="progressMargin" now={80} label="80% Done"/>
        </Container>
        <Oldcover onSubmit={this.onSubmit} 
          handleInputChange={this.handleInputChange} 
          controls={this.state.oldCoverControls} 
          ref={this.oldCoverControls}
        />

        <Container>
          <Card className="termsBox">
            <Card.Body>
              <Row>
                <Col className="termsDes termsConBox" sm={8}><p>I have read and I accept the Privacy Policy</p></Col>
                <Col>
                  <Checkbox name="termsControls.privacy_policy"
                    color="success" 
                    onChange={this.handleInputChange}
                    touched={this.state.termsControls.privacy_policy.touched}
                    valid={this.state.termsControls.privacy_policy.valid}
                    error={!(this.state.termsControls.privacy_policy.valid)}/>
                    {(!this.state.termsControls.privacy_policy.valid) ?
                    <FormHelperText className="validationHelpText">
                      {this.state.termsControls.privacy_policy.errorMessage}
                    </FormHelperText>
                    : '' }
                </Col>
              </Row>
              <Row>
                <Col className="termsDes termsConBox" sm={8}><p>Please tick this box if you allow us to contact you about discounts, 
                special offers <br/>and information by post, email, SMS, phone and other electronic means.</p></Col>
                <Col> 
                  <Checkbox name="termsControls.offers"
                    color="success"/>
                </Col>
              </Row>
              <Row>
                <Col className="termsDes termsConBox" sm={8}><p>Do you accept the assumptions and terms of business?</p></Col>
                <Col> 
                  <Checkbox name="termsControls.terms"
                    color="success"
                    onChange={this.handleInputChange}
                    touched={this.state.termsControls.terms.touched}
                    valid={this.state.termsControls.terms.valid}
                    error={!(this.state.termsControls.terms.valid)}/>
                    {(!this.state.termsControls.terms.valid) ?
                    <FormHelperText className="validationHelpText">
                      {this.state.termsControls.terms.errorMessage} 
                    </FormHelperText>
                    : '' }
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <FormHelperText className="validationHelpText"><span id = "errorTextBottom"></span></FormHelperText>
          <Row>
            <Col>
              <Button id = "submitButton" type="submit" className="submitButton" size="lg" block onClick={this.onSubmit}>Get Quote</Button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}


export default Home;