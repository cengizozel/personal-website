function Header() {
    return (
        <header>
            <title>Cengiz Ozel</title>
        </header>
    )
}

function Content() {
    return (
        <body>
            <div className="name-box">Cengiz Ozel</div>

            <div className="about-box">Recent graduate from the University of Rochester with a BS in Computer Science. Through my courses and personal projects, I gained an in-depth understanding of algorithmic thinking, computational problem solving, and other fundamentals of computer programming. Currently doing research at the University of Rochester while being open to new opportunities.
            </div>

            <div className="contact-box">Contact</div>
        </body>
    )
}

function Footer() {
    return (
        <footer className="copyright-text">
            <small>Copyright &copy; 2022 Cengiz Ozel</small>
        </footer>
    )
}

function Page() {
    return (
        <div>
            <center>
            <Header />
            <Content />
            </center>
            <Footer />
        </div>
    )
}

ReactDOM.render(<Page />, document.getElementById('root'));