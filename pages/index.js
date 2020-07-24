import Head from 'next/head';
import Link from 'next/link';
import Menu from '../pages/components/menu.js';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>quizList</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
		<Menu />
        
        <p className="description">
    		<Link href="/create"><a>Create your own quizList here</a></Link>
			<Link href="/init"><a>Or play the countries of the world quiz.</a></Link>
        </p>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
