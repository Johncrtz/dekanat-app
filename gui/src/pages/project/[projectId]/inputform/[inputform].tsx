//import CreateSelectItems from "./createSelectItems"
import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Select,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Link from "components/Link"
import React, { useEffect, useState } from "react"
import { makeStyles } from "@mui/styles";
import { minWidth } from "@mui/system";
import db from "DB/db.json"
import Idb from "DB/Idb"

import db2 from "DB/db2.json"
import Idb2 from "DB/Idb2"
import db3 from "DB/db3.json"
import Idb3 from "DB/Idb3"
import { json } from "stream/consumers";
import { TableChart } from "@mui/icons-material";

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
                            Dokument 1
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


