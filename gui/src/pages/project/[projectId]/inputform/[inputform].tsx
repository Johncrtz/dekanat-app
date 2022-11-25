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
import { styled, useTheme } from "@mui/material/styles"
import React, { useEffect, useState } from "react"
import db from "DB/dbex.json"
import Idb from "DB/Idbex"
import { json } from "stream/consumers";

const InputformPage = () => {
  const theme = useTheme()
  const values:Idb = db.exampleTable
  let currPage = 0
  console.log(values)

    return (
        <Paper 
          elevation={5} 
          style={{'padding': 40}}
        >
          <Grid
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <span style={{...theme.typography.h4, }}>{values['Form Title']}</span>
            </Grid>
            <Grid item xs={12}>
              <span style={{...theme.typography.body1}}>{values['Form Description']}</span>
            </Grid>
              {values['Pages'].map((page, i:number) => (
                <Grid item xs = {12} key={i}>
                {values['Pages'][i]['Questions'].map((question: any, j: number) => (
                  <Grid key={j}>{question['Question']}</Grid>
                ))}
                </Grid>
              ))}
            
            {/* {values['Pages'].map((item, i:number) => (
                  <Grid item xs={6} key= {i}>
                    <form>
                      {(() => {
                        if (item[1]['Type'] == "Input") {
                          return (
                            <TextField required={item[1]['Required']} label={item[0]} variant="filled" />
                          )
                        }
                        else if (item[1]['Type'] == "Select") {
                          return (
                            <FormControl variant="filled" sx={{ minWidth: 120 }}>
                              <InputLabel id="demo-simple-select-filled-label">{item[0]}</InputLabel>
                              <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={item[1]['Value']}
                                label={item[0]}
                              >
                                {item[1]['Values'].map((item2: any, i: number) => (
                                  <MenuItem value={item2} key={i}>{item2}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )
                        }
                        else if (item[1]['Type'] == "File") {
                          return (
                          <Button
                            variant="contained"
                            component="label"
                          >
                            Upload File
                            <input
                              type="file"
                              hidden
                            />
                          </Button>
                          )
                        }
                      })()}
                    </form>
                  </Grid>
              ))} */}

            <Grid item xs={12}>
              <Button 
                variant="contained" 
                style={{...theme.colorScheme, ...theme.typography}} 
                onClick = {() => {console.log("Button clicked")}}
              >
                Submit
              </Button> 
            </Grid>
          </Grid>
       </Paper>
    )
        
}
 
export default InputformPage;

//function useAPI(): { project: any } {
//    throw new Error("Function not implemented.")
//}