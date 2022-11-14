//import CreateSelectItems from "./createSelectItems"
import {
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Select,
    Typography,
    Button
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Link from "components/Link"
import React, { useEffect, useState } from "react"
import { makeStyles } from "@mui/styles";
import { minWidth } from "@mui/system";


const useSytles = makeStyles((theme?: any) => ( {
    formcontrol: {
        minWidth: 150
    }
}));

const CreateSelectItems = () => {

    const[value, setValue] = useState("");
    const classes = useSytles();

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setValue(e.target.value)


    return (
        <div>

            <FormControl size = "medium" className ={classes.formcontrol}>
                <InputLabel>Select attribute</InputLabel>
                <Select onChange= {handleChange} autoWidth = {true} >
                    <MenuItem value= {"Date"}>Date</MenuItem>
                    <MenuItem value= {"Name"}>Name</MenuItem>
                    <MenuItem value= {"First name"}>First name</MenuItem>
                </Select>
            </FormControl>
            <Button variant="outlined" size="medium">Delete</Button>
        </div>
     );
}

const InputformPage = () => {
    const theme = useTheme()
    const [list, setList] = useState([{listItem: " "},
    ]);


    return (

        <><Typography
            sx={{
                mb: theme.spacing(4),
                color: theme.palette.text.secondary,
            }}
        >
            Deine Inputform in{" "}
            <Link href={`/project/34`}>
                Project
            </Link>
        </Typography>
  
            <Grid container spacing={3}>
                <Grid item xs = {6}>
                    
                    
                    
                </Grid>
                <Grid item xs = {6}>
                    <Paper>
                        <CreateSelectItems></CreateSelectItems>
                    </Paper>
                </Grid>
            </Grid>
            
        
            
        </>

    );
}
 
export default InputformPage;

//function useAPI(): { project: any } {
//    throw new Error("Function not implemented.")
//}


