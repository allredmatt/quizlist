import {useState} from 'react'
import Link from 'next/link';
import Menu from './components/menu.js'
import {faunaKey} from '../.fauna.js'
import { GraphQLClient } from 'graphql-request'

const address = "www.myaddress.com/"

const endpoint = 'https://graphql.fauna.com/graphql'
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`,
  },
});
const CreatedAlert = ({id, closeFunction}) => {
    return (<div>
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeFunction}>&times;</span>
                <p>You have created a new quizList with ID: {id}. Share the following link for people to play: <Link href={"/"+id}><a>{address + id}</a></Link>
                </p>
            </div>
        </div>
        <style jsx>{`
            .modal {
            position: fixed; 
            z-index: 1; 
            padding-top: 100px; 
            left: 0;
            top: 0;
            width: 100%; 
            height: 100%; 
            overflow: auto; 
            background-color: rgb(0,0,0); 
            background-color: rgba(0,0,0,0.4); 
            }
            .modal-content {
              background-color: #fefefe;
              margin: auto;
              padding: 20px;
              border: 1px solid #888;
              width: 80%;
            }
            
            .close {
              color: #aaaaaa;
              float: right;
              font-size: 28px;
              font-weight: bold;
            }
            .close:hover,
            .close:focus {
              color: #000;
              text-decoration: none;
              cursor: pointer;
            }
        `}</style>
    </div>)
}

export default function Create() {
    
    const initialValues = {
        textAreaInput: "",
        timeInput: 1,
        descriptionInput: "",
        nameInput: "",
    }
    const [formData, setFormData] = useState(initialValues);
    const [returnedID, setReturnedID] = useState();
    
    const updateGQLDB = async (name, time, description, content) => {
    
        let Id = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);
    
        const mutation = /* GraphQL */ `
                mutation createLists($Id: String!, $name: String!, $description: String!, $content: [String]!, $time: Int) {
                    createLists(
                        data:{
                            Id: $Id,
                            name: $name,
                            time: $time,
                            description: $description,
                            content: $content,
                        }
                    ) {
                    _id
                    }
                }
        `
        const variables = {
            "Id": Id,
            "name": name,
            "time": time,
            "description": description,
            "content": content,
        }
        const data = await graphQLClient.request(mutation, variables);
        setReturnedID(Id);
    }

    const handleButtonPress = () => {
        let contentList = formData.textAreaInput.split(/\r?\n/)
        updateGQLDB(formData.nameInput, formData.timeInput, formData.descriptionInput, contentList)
    }

    const onPopUpClose = () => {
        setFormData(initialValues)
        setReturnedID(null)
        console.log("Reset")
    }

    return (
        <div>
            <Menu />
            <div className="create">
                <p>Please enter your list, in the order you want for the items to appear. Each new item should be on a new line, the quiz is case-sensitive.</p>
                <form>
                    Name of quizList:
                    <input type="text" placeholder="Name..." value={formData.nameInput} onChange={(e)=>setFormData({...formData, nameInput: e.target.value})} />
                    List Data:
                    <textarea placeholder="Enter list here..." value={formData.textAreaInput} onChange={(e)=>setFormData({...formData, textAreaInput: e.target.value})} />
                    Info for user:
                    <input type="text" placeholder="Brief Description of the quiz and any instructions..." value={formData.descriptionInput} onChange={(e)=>setFormData({...formData, descriptionInput: e.target.value})} />
                    Timer for quizList (in whole mins):
                    <input type="number" placeholder="Time (in whole mins)..." value={formData.timeInput} onChange={(e)=>setFormData({...formData, timeInput: Math.abs(Math.floor(e.target.value))})} />
                </form>
                <button onClick={handleButtonPress}>Save</button>
            </div>
            {returnedID && <CreatedAlert id={returnedID} closeFunction={onPopUpClose}/>}
            <style jsx global>{`
                body {
                    background-color: aliceblue;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
                }
            `}</style>

            <style jsx>{`
                .create {
                    text-align: left;
                    background-color: thistle;
                    max-width: 60%;
                    min-width: 400px;
                    margin: 0 auto;
                    border-radius: 3px;
                    height: 600px;
                }
                form {
                    position : relative;
                    margin : 0 auto;
                    padding: 1em;
                    box-sizing: border-box;
                    display  : grid;
                    grid-gap : 20px;
                    grid-template-columns : 10em 30em;
                    grid-template-rows    : 2em 20em 2em 2em;
                }
                textarea {
                    font-size: 14.666667;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
                    box-sizing: border-box;
                    border  : none;
                    border-radius: 3px;
                    padding: 8px;
                    resize: none;             
                    overflow: auto;
                }
                button {
                    position : relative;
                    left : 15px;
                }
            `}</style>

        </div>


    )
}