//import CreateSelectItems from "./createSelectItems"
import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button,
    Paper,
    TextField,
} from "@mui/material"
import { styled, Theme, useTheme } from "@mui/material/styles"
import React, { useEffect, useState } from "react"
import db from "DB/dbex.json"
import Idb, { Question } from "DB/Idbex"
import { json } from "stream/consumers";
// import { LoadQuestion as lq} from "./selectItemsClass"


const fieldInput = (question: Question) => { 

  if (question['Question Type'] == 'Input') {
    return (
      <TextField 
        required={Boolean(question['isRequired'])} 
        label={question['Question']} 
        variant='filled' 
        fullWidth
        onChange={event => console.log(event.target.name, event.target.value)}
        sx={{ marginTop: '10px', marginBottom: '10px' }}
      />
    )
  } else if (question['Question Type'] == 'Select' && question['Values'] != null) {
    return (
      <TextField
        select
        required={Boolean(question['isRequired'])} 
        label={question['Question']}
        sx={{ marginTop: '10px', marginBottom: '10px' }}
        variant='filled'
        fullWidth
      >
        {question['Values'].map((option: any, i: number) => (
          <MenuItem value={option} key={i}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    )
  } else if (question['Question Type'] == 'File') {
    return (
        <TextField
          required={Boolean(question['isRequired'])}
          name={String(question['Question'])}
          helperText={question['Question']}
          type='file'
          fullWidth
          sx={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}
        />
    )
  } else if (question['Question Type'] == 'Number')  {
    return (
      <TextField
        required={Boolean(question['isRequired'])}
        label={question['Question']}
        type='number'
        fullWidth
        sx={{ marginTop: '10px', marginBottom: '10px' }}
        variant='filled'
      />
    )
  } 



  // Implement later - not working rn
  // let load = new lq(question)

  // Holy shit this might actually work
  // return load[question['Question Type'] as keyof lq] as Function;
}



const FormButtons = (page: number, last: Number, theme: Theme) => {

  const [pageNumber, setPageNumber] = useState(page)
  
  const handlePage = (n: number) => {
    setPageNumber(n)
  }
  
    if (pageNumber == 1) {
      return (
        <Button 
          variant='contained' 
          style={{...theme.colorScheme, ...theme.typography}} 
          onClick = {() => {handlePage(pageNumber + 1)}}
        >
          Next
        </Button> 
      )
    } else if (pageNumber == last) {
      return (
        <Button 
          variant='contained' 
          style={{...theme.colorScheme, ...theme.typography}} 
          onClick = {() => {handlePage(pageNumber - 1)}}
        >
          Submit
        </Button> 
      )
    } else {
      return (
        <>
          <Grid item xs={6}>
            <Button
              variant='contained' 
              style={{...theme.colorScheme, ...theme.typography}} 
              onClick = {() => {handlePage(pageNumber - 1)}}
            >
              Previous
            </Button> 
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained' 
              style={{...theme.colorScheme, ...theme.typography}} 
              onClick = {() => {handlePage(pageNumber + 1)}}
            >
              Next
            </Button> 
          </Grid>
        </>
      )
    }
  }
  

const inputformPage = () => {
  const theme = useTheme()
  const values:Idb = db.exampleTable
  let currPage = 1
  const totalPages = values["Pages"].length
  console.log(values)

  const [formData, setFormData] = useState({})

  const handleInputChange = (e: any, q: string) => {
    const value = e.target.value;
    let updatedFormData = {};
    updatedFormData = {[q]: value};
    setFormData(formData => ({
      ...formData,
      ...updatedFormData
    }));
  }

    return (
        <Paper 
          elevation={5} 
          style={{"padding": 40}}
        >
          <Grid
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <span style={{...theme.typography.h4, }}>{values["Form Title"]}</span>
            </Grid>
            <Grid item xs={12}>
              <span style={{...theme.typography.body1, paddingTop: "5px"}}>{values["Form Description"]}</span>
            </Grid>
              {values["Pages"].map((page, i:number) => (
                <Grid item xs={12} key={i}>
                {values["Pages"][i]["Questions"].map((question: Question, j: number) => (
                  <Grid key={j}>
                    <TextField 
                      required={Boolean(question['isRequired'])} 
                      label={question['Question']} 
                      variant='filled' 
                      fullWidth
                      onChange={event => handleInputChange(event, question['Question'])}
                      sx={{ marginTop: '10px', marginBottom: '10px' }}
                    />
                    {/* {fieldInput(question)} */}
                  </Grid>
                ))}
                </Grid>
              ))}
            <Grid item xs={12}>
              <Button 
            variant='contained' 
            style={{...theme.colorScheme, ...theme.typography}} 
            onClick = {() => {console.log(formData)}}
          >
            Submit
          </Button> 
              {/* {FormButtons(currPage, totalPages, theme)} */}
            </Grid>
          </Grid>
       </Paper>
    )
        
}
 
export default inputformPage;

//function useAPI(): { project: any } {
//    throw new Error("Function not implemented.")
//}