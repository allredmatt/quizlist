import Link from 'next/link';

function Menu() {
    return (
        <div>
            <h1>
                quizList - The quiz that's a list!
            </h1>
            <nav>
                <Link href="/">
                    <a>Home</a>
                </Link>
                <Link href="/create">
                    <a>New</a>
                </Link>
                <Link href="/search">
                    <a>Find</a>
                </Link>
                <Link href="/about">
                    <a>About</a>
                </Link>
            </nav>
            <style jsx>{`
                h1 {
                    text-align: center;
                }
                nav {
                    position: relative;
                    margin: 0 auto;
                    height: 40px;
                    justify-content: space-between;
                    
                }
                a:link, a:visited {
                    background-color: thistle;
                    color: black;
                    padding: 14px 25px;
                    margin: 2px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    border: 1px solid thistle;
                    border-radius: 4px;
                }
                a:hover, a:active {
                    border: 1px solid lavender;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    )
}

export default Menu