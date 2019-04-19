
"use strict";

/**
 * 
 * @description Flattens a JSON object into label and value pairs
 * @param {string} [label=""] - The root label the JSON properties will be appended to.
 * @param {object} sampleData - JSON object to be flattened.
 * @returns {array} - array of objects in {label:"","value":""} format.
 */
const getVariableSelectData = (label = "", sampleData) => {
  //console.log('LEVEL', level);

  const getNewLabel = (oldLabel = "", key = "") => {
    return (oldLabel && oldLabel.length > 0 ? oldLabel + "." : "") + key;
  };

  const getObjectStuff = (label = "", sampleData) => {
    if (typeof (sampleData) === "object") {
      const firstRun = Object.keys(sampleData).map((key) => {
        if (typeof (sampleData[key]) === "object" && sampleData[key] !== null) {
          // must check for array 
          if (Array.isArray(sampleData[key])) {
            // array so do my magic here 
            return sampleData[key].map((item, index) => {
              if (typeof (item) === "object" && item !== null && Object.keys(item).length > 0) {
                // ok this is an object within array 
                return getObjectStuff(getNewLabel(`${label}`, `${key}[${index}]`), item );
              } else {
                if (item === null || Object.keys(item).length === 0) {
                  return { "label": getNewLabel(`${label}`, `${key}[${index}]`), "value": "NULL" };
                } else {
                  return { "label": getNewLabel(`${label}`, `${key}[${index}]`), "value": item };
                }
              }
            });
          } else {
            // it is an object so recursion
            if (Object.keys(sampleData[key]).length > 0) {
              // 
              const mySecondary = getObjectStuff(getNewLabel(`${label}`, `${key}`), sampleData[key] );
  
              return mySecondary;
            } else {
              return { "label": getNewLabel(`${label}`, `${key}`), "value": "EMPTY" };
            }
  
          }
        } else {
          if (sampleData[key] === null) {
            return { "label": getNewLabel(`${label}`, `${key}`), "value": "NULL" };
          } else {
            return { "label": getNewLabel(`${label}`, `${key}`), "value": sampleData[key] };
          }
        }
      });
      const myReturn = [].concat(firstRun);
      //console.log('myREturn', myReturn);
  
      return myReturn;
  
  
    } else {
      console.warn('sample data provided to getVariableSelectData was not an object', sampleData);
      return [];
    }
  };

  let myReturn=[];
  const myData =  getObjectStuff(label, sampleData);

  const dedupArray = (myData) =>{
    let myReturn = [];
    myData.forEach((item)=>{
      if (Array.isArray(item)){
        myReturn = [].concat.apply(myReturn, item);
      } else {
        myReturn = myReturn.concat(item);
      }
    });
    return myReturn;
  };

  const hasArrayData = (myData) =>{
    return myData.reduce((p,c)=>{
      if (!p){
        if (Array.isArray(c)){
          return true;
        }
      }
      return p;
    }, false);
  };

  //console.log('mmmmmm', myData);
  myReturn = [].concat(myData);
  let bClean = true;
  let mLevels = 0;
  while (bClean && ++mLevels < 100){
    
    bClean = hasArrayData(myReturn);
    if(bClean){
      //console.log('cleaning because i still have arrays', myReturn);
      myReturn = dedupArray(myReturn);
      //console.log('after clean: ', myReturn);
    } else {
      //console.log('ssssss', bClean, myReturn);
    }
 
  }

  return myReturn;
};

/**
 *
 * @description Replaces marked words in a string with the contencts of a JSON object
 * @param {string} [incomingString=""] - String marked for replacement "Something +replaceMe"
 * @param {object} [sampleData={}] - JSON data such as {"replaceMe":"important" }
 * @returns {string} - String with replacemed values, such as "Somthing important"
 */
const replaceVariableInput = (incomingString = "", sampleData = {}) => {
  const variableSelectData = getVariableSelectData("", sampleData);

  let newInput = incomingString + "";
  // use regex to get inputs to replace 
  const regexMatches = incomingString.match(/(\+\S+)/g);

  // console.log('xxxxx', regexMatches, variableSelectData);
  // replace based on variableSelectData
  regexMatches && regexMatches.length > 0 && regexMatches.forEach((item)=>{
    
    let endPos = item.length ;
    if ( [";", ":", ",", ".", "!", "?" ].indexOf(item.charAt(item.length - 1)) !== -1){
      endPos = item.length -2;
    }
    
    const replacementName = item.substr(1, endPos); //strip off + 
    // console.log(item, item.charAt(item.length -1), item.length, endPos, replacementName);
    const replacementValue = variableSelectData.reduce((p,c,i)=>{
      // console.log('xxxx', p, c, i );
      if (!p) {
        if (c.label === replacementName) {
          return c.value;
        }
      }
      return p;
    }, undefined);
    // console.log('>>>', replacementName, replacementValue, replacementValue.length);
    if (replacementValue && replacementValue.toString().length > 0) {
      newInput = newInput.replace(new RegExp("\\+"+replacementName, 'g'), replacementValue);
    }

  });
  return newInput;
};

/**
 * 
 * @description Flattens a JSON object into an object needed by contentEditble compoents 
 * @param {object} sampleData - JSON object to be flattened.
 * @returns {object} - JSON object with key and value 
 */
const getContentEditableData = (sampleData) => {
  const data = S2STools.getVariableSelectData("", sampleData);
  const rData = {};
  data.forEach((obj)=>{
    rData[obj.label] = obj.value;
  });
  return rData;
};

module.exports = {
  replaceVariableInput,
  getVariableSelectData,
  getContentEditableData
};