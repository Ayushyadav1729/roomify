import React from 'react'
import {Box} from "lucide-react";
import Button from "./ui/Button";
import {Link, useNavigate, useOutletContext} from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut} = useOutletContext<AuthContext>();
    const navigate = useNavigate();

    const handleAuthClick = async () => {
        if(isSignedIn) {
            try {
                await signOut();
            } catch (e){
                console.error(`Puter sign out failed: ${e}`)
            }
            return;
        }

        try {
            await signIn();
        }catch (e) {
            console.error(`Puter sign in failed with error: ${e}`);
        }
    };

    const handleWorkspaceClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isSignedIn) return;

        e.preventDefault();

        try {
            const signedIn = await signIn();
            if (signedIn) {
                navigate("/projects");
            }
        } catch (error) {
            console.error(`Puter sign in failed with error: ${error}`);
        }
    };

    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className="logo" />

                        <span className="name">
                            Planora
                        </span>
                    </div>

                    <ul className="links">
                        <Link to="/">Home</Link>
                        <Link to="/create">Create</Link>
                        <Link to="/projects" onClick={handleWorkspaceClick}>Workspace</Link>
                    </ul>
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                        <span className ="greeting">
                            {userName ? `hi, ${userName}`:'Singned in'}
                        </span>

                         <Button size="sm" onClick={handleAuthClick} className="btn">
                         Log Out
                         </Button>
                        </>
                    ) : (
                        <>
                            <Button
                            onClick={handleAuthClick}
                            size="sm" variant="ghost">
                            Log In
                        </Button>

                            <a href="#upload"
                               className="cta">Get
                                Started</a>
                        </>
                    )}

                </div>
            </nav>
        </header>
    )
}

export default Navbar
