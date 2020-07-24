import Quiz from '../pages/components/quiz.js';
import {faunaKey} from '../.fauna.js'
import { GraphQLClient } from 'graphql-request'

const endpoint = 'https://graphql.fauna.com/graphql'
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${faunaKey}`,
  },
});

export default function UserQuiz ({quizData}) {
    return <Quiz list={quizData}/>
}

export async function getStaticPaths() {

    const query = /* GraphQL */ `
        {
            allIds {
                data {
			        Id
                }
            }
        }
    `
    const data = await graphQLClient.request(query);
    const paths = data.allIds.data.map((id) => { return {params:{'Id': id.Id}}})

    return {
      paths,
      fallback: false
    }
}

export async function getStaticProps({ params }) {

  const queryLookupId = /* GraphQL */ `
        {
            findId (Id: "${params.Id}"){
                _id
            }
        }
    `
  const IdServerData = await graphQLClient.request(queryLookupId);
  console.log(IdServerData.findId._id)
  const Id = IdServerData.findId._id

  const queryById = /* GraphQL */ `
      {
          findListsByID (id: ${Id}){
              _id
              name
              time
              content
              description
          }
      }
  `
  const data = await graphQLClient.request(queryById);
  const quizData = data.findListsByID;

  return {
    props: {
      quizData
    }
  }
}
  