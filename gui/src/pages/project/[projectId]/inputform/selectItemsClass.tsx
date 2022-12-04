import { FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, TextField } from "@mui/material"
import { Question } from "DB/Idbex";

class LoadQuestion {
  question: Question;

  constructor(q: Question) {
    this.question = q;
  }

  Input() {
    return (
      <TextField 
        required={Boolean(this.question["isRequired"])} 
        label={this.question["Question"]} 
        variant="filled" 
        fullWidth
        sx={{ marginTop: "10px", marginBottom: "10px" }}
      />
    )
  }

  Dropdown() {
    if (this.question["Values"]) {
      return (
        <TextField
          select
          required={(this.question["isRequired"])} 
          label={this.question["Question"]}
          sx={{ marginTop: "10px", marginBottom: "10px" }}
          variant="filled"
          fullWidth
        >
          {this.question["Values"].map((option: any, i: number) => (
            <MenuItem value={option} key={i}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )
    } else { 
      return (
      <Grid item>
        Error(`${this.question["Question"]} does not have valid button options`)
      </Grid>)
    }
}

  Number() {
    return (
      <TextField
        required={(this.question["isRequired"])}
        label={this.question["Question"]}
        type="number"
        fullWidth
        sx={{ marginTop: "10px", marginBottom: "10px" }}
        variant="filled"
      />
    )
  }

  // Buttons() {
  //   if (this.question["Values"]) {
  //     return (
  //       <FormControl>
  //         <FormLabel>{this.question["Question"]}</FormLabel>
  //         <RadioGroup>
  //           {this.question["Values"].map((option: any, i: number) => (
  //             <FormControlLabel value={option} key={i} control={<Radio />} label={option}>
  //             </FormControlLabel>
  //           ))}
  //         </RadioGroup>
  //       </FormControl>
  //     )

  //   } else { 
  //     return (
  //     <Grid item>
  //       Error(`${this.question["Question"]} does not have valid button options`)
  //     </Grid>)
  //   }
  // }
  
  File() {
    return (
      <TextField
        required={(this.question["isRequired"])}
        name={(this.question["Question"])}
        helperText={this.question["Question"]}
        type="file"
        fullWidth
        sx={{ textAlign: "center", marginTop: "10px", marginBottom: "10px" }}
      />
    )
  }

}
export { LoadQuestion };