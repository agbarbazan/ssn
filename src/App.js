import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

const normalizeCardNumber = (value) => {
  //remove all non-numerics
  const noSpacesValue = value.replace(/[^0-9|\\*]/g, '') 

  let newValue = '';

  if(noSpacesValue.length > 0){
    //https://www.ssa.gov/employer/stateweb.htm - area numbers range from 001 - 586
    const areaNumber = noSpacesValue.slice(0,3);
    newValue += areaNumber;
  }

  if(noSpacesValue.length > 3){
    const groupNumber = noSpacesValue.slice(3,5);
    newValue += ' ' + groupNumber;
  }

  if(noSpacesValue.length > 5){
    const serialNumber = noSpacesValue.slice(5);
    newValue += ' ' + serialNumber;
  }
  return newValue;
}

const checkValidSSN = (value, setError) => {
  //***note: value may include spaces in its length given SSN format */

  //SSA will not issue SSNs beginning with the number “9”
  if(value.length === 1 && value[0] === '9'){
    setError('SSN cannot begin with the number "9"')
    return false;
  }
  if(value.length === 3 && Number(value) === 666){
    setError('SSN cannot begin with the number "666"')
    return false;
  }

  //SSA will not issue SSNs beginning with the number “000” in positions 1 – 3
  if(value.length === 3 && Number(value.slice(0)) === 0){
    setError('SSN cannot begin with the number "000"')
    return false
  }
   //SSA will not issue SSNs with the number “00” in positions 4 – 5.
   if(value.length === 6 && Number(value.slice(4)) === 0){
    setError('SSN cannot have a group number of "00"')
    return false
  }
  
  if(value.length === 11 && Number(value.slice(7)) === 0){
    setError('SSN cannot have a serial number of "0000"')
    return false
  }
  return true;
}

function App() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [fromValue, setFormValue] = useState('')

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="cardNumber">Card Number:</label>
        <input
          placeholder="--- -- ----"
          type="text"
          inputMode="numeric"
          name="cardNumber"
          id="cardNumber"
          maxLength={11}
          onChange={(event) => {
            const {value } = event.target
          
            if(!checkValidSSN(value, setError)) return
            const normValue = normalizeCardNumber(value)
            
            setFormValue(normValue || '')
            setError('')
          }}
          value={fromValue}
          ref={register}
        />
        
         {error && <div className='error'>{error}</div>}

      </div>
     
      <button>Submit</button>
    </form>
  );
}

export default App;
