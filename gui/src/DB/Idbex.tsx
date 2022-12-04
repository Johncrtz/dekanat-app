export interface Question {
    "Question Number": number,
    "Question": string,
    "Question Type": string, 
    "Question Description"?: string,
    "isRequired"?: boolean,
    "Table Name": string,
    "Column Name": string,
    "Values"?: string[]
}

export interface Page {
    "Page Title": string
    "Page Description"?: string
    "Questions": Question[]
}

export interface Form {
    "Form Title": string,
    "Form Description"?: string,
    "Pages": Page[]
}

export default Form