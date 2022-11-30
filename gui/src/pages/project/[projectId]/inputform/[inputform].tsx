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
import { CreateSelectItems } from "./createSelectItems"


// fill in all the questions types





// Look at visitor patterns
const fieldInput = (question: Question) => { 
  if (question['Question Type'] == 'Input') {
    return (
      <TextField 
        required={Boolean(question['isRequired'])} 
        label={question['Question']} 
        variant='filled' 
        fullWidth
        sx={{ marginTop: '10px', marginBottom: '10px' }}
      />
    )
  } else if (question['Question Type'] == 'Select') {
    return (
      <TextField
        select
        required={Boolean(question['isRequired'])} 
        label={question['Question']}
        sx={{ marginTop: '10px', marginBottom: '10px' }}
        variant='filled'
        fullWidth
      >
        {question['Selects'].map((option: any, i: number) => (
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
}

const FormButtons = (page: number, last: Number, theme: Theme) => {
  if (page == 1) {
    return (
      <Button 
        variant='contained' 
        style={{...theme.colorScheme, ...theme.typography}} 
        onClick = {() => {console.log('Button clicked')}}
      >
        Next
      </Button> 
    )
  } else if (page == last) {
    return (
      <Button 
        variant='contained' 
        style={{...theme.colorScheme, ...theme.typography}} 
        onClick = {() => {console.log('Button clicked')}}
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
            onClick = {() => {console.log('Button clicked')}}
          >
            Previous
          </Button> 
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained' 
            style={{...theme.colorScheme, ...theme.typography}} 
            onClick = {() => {page -= 1; console.log(page)}}
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
  const totalPages = values['Pages'].length
  console.log(values)

    return (
        <Paper 
          elevation={5} 
          style={{'padding': 40}}
        >
          <Grid
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={12}>
              <span style={{...theme.typography.h4, }}>{values['Form Title']}</span>
            </Grid>
            <Grid item xs={12}>
              <span style={{...theme.typography.body1, paddingTop: '5px'}}>{values['Form Description']}</span>
            </Grid>
              {values['Pages'].map((page, i:number) => (
                <Grid item xs={12} key={i}>
                {values['Pages'][i]['Questions'].map((question: any, j: number) => (
                  <Grid key={j}>
                    {CreateSelectItems[question['Question Type']]()}
                  </Grid>
                ))}
                </Grid>
              ))}
            {/* <Grid item xs={12}> */}
              {FormButtons(currPage, totalPages, theme)}
            {/* </Grid> */}
          </Grid>
       </Paper>
    )
        
}
 
export default inputformPage;

//function useAPI(): { project: any } {
//    throw new Error('Function not implemented.')
//}