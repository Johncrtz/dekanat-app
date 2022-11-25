export interface Question {
    "Question Number": Number,
    "Question": String,
    "Question Type": String, 
    "Question Description": String,
    "isRequired": Boolean,
    "Table ID": String,
    "Selects": String[]
}

interface Page {
    "Page Title": String
    "Page Description": String
    "Questions": Question[]
}

export interface Form {
    "Form Title": String,
    "Form Description": String,
    "Page Count": Number,
    "Pages": Page[]
}

export default Form