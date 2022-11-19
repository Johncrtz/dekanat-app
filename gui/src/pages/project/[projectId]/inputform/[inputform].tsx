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
    CardContent
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
        <Grid container spacing={2}> 
             {arr.map((item, i:number) => (
                <Grid item key= {i}>
                  <form>
                    <label>{item[0]}</label>
                    <input 
                      type="text"
                      required/>
                  </form>
                </Grid>
             )
             )}

        </Grid>
       </>
    )
        
}
 
export default InputformPage;

//function useAPI(): { project: any } {
//    throw new Error("Function not implemented.")
//}


