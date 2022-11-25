//import CreateSelectItems from "./createSelectItems"
import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button,
    TextField,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import React, { useEffect, useState } from "react"
import db from "DB/dbex.json"
import Idb from "DB/Idbex"
import { json } from "stream/consumers";

const InputformPage = () => {
  const theme = useTheme()
  const values:Idb = db.exampleTable[0]
  const arr = Object.entries(values)

    return (
        <>
        <Grid 
        container 
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"> 
             {arr.map((item, i:number) => (
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
             ))}
             <Button variant="contained">Submit</Button> 
        </Grid>
       </>
    )
        
}
 
export default InputformPage;

//function useAPI(): { project: any } {
//    throw new Error("Function not implemented.")
//}


