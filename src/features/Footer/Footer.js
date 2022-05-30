import react from 'react';
import './Footer.css';

export function Footer() {
    return (
        <div className="footer-container">
            <h4 className="logo">Grocery App</h4>
            <div className="socials">
                <a>Facebook</a>
                <a>Twitter</a>
                <a>Linkedin</a>
                <a>Github</a>
            </div>
            <a>Contact Me</a>
        </div>
    );
}