import Menu from '../pages/components/menu.js';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import {faunaKey} from '../.fauna.js'
import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://graphql.fauna.com/graphql'
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`,
  },
});


export default function Find () {

    const [input, setInput] = useState("");
    const [nameListsFromDB, setNameListsFromDB] = useState([]);

    useEffect(()=>{
        fetchNameListFromDB().then(response => setNameListsFromDB(response));
    },[])

    let regex = input ?  new RegExp (`${input}`, 'i') : new RegExp (`[A-Z]`, 'i')

    return(
        <div>
            <Menu />
            <div>
                <p>Looking for a quiz list, look no further. If you can't find the one you want, try and <Link href="/create"><a>create one</a></Link>.</p>
                <input type="text" placeholder="Name of quizList to find..." value={input} onChange={(e)=>setInput(e.target.value)} />
            </div>
            <ul>
                {nameListsFromDB.filter((list)=>list.name.match(regex)).map((list)=><li key={list.Id}><Link href={"/"+list.Id}><a className="menu-style">{list.name}</a></Link></li>)}
            </ul>
            <style jsx>{`
            .menu-style a:link, .menu-style a:visited {
                    background-color: thistle;
                    color: black;
                    padding: 5px 25px;
                    margin: 2px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    border: 1px solid thistle;
                    border-radius: 4px;
                }
                .menu-style a:hover, .menu-style a:active {
                    border: 1px solid lavender;
                    border-radius: 4px;
                }
            }
            ul {
                list-style-type: none
            }
            `}</style>
        </div>
)
}

async function fetchNameListFromDB() {
    const query = /* GraphQL */ `
        {
            allIds {
                data {
			        name
                    Id
                }
            }
        }
    `;
    const data = await graphQLClient.request(query);
    return data.allIds.data
}
