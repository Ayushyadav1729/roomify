import { ArrowUpRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import Navbar from "../../components/Navbar";
import { getProjects } from "../../lib/puter.action";
import Button from "../../components/ui/Button";

export default function Projects() {
    const navigate = useNavigate();
    const { isSignedIn, signIn } = useOutletContext<AuthContext>();
    const [projects, setProjects] = useState<DesignItem[]>([]);

    useEffect(() => {
        if (!isSignedIn) return;

        const fetchProjects = async () => {
            const items = await getProjects();
            setProjects(items);
        };

        void fetchProjects();
    }, [isSignedIn]);

    if (!isSignedIn) {
        return (
            <div className="home">
                <Navbar />
                <section id="projects" className="projects">
                    <div className="section-inner">
                        <div className="empty">
                            <h2>Workspace</h2>
                            <p>Log in or sign up to open your workspace.</p>
                            <Button size="lg" onClick={signIn}>
                                Log In / Sign Up
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="home">
            <Navbar />
            <section id="projects" className="projects">
                <div className="section-inner">
                    <div className="section-head">
                        <div className="copy">
                            <h2>Workspace</h2>
                            <p>Your latest work and shared community projects, all in one place.</p>
                        </div>
                    </div>

                    <div className="projects-grid">
                        {projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => (
                            <div
                                key={id}
                                className="project-card group"
                                onClick={() => navigate(`/visualizer/${id}`)}
                            >
                                <div className="preview">
                                    <img src={renderedImage || sourceImage} alt="Project" />
                                    <div className="badge">
                                        <span>Community</span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div>
                                        <h3>{name}</h3>

                                        <div className="meta">
                                            <Clock size={12} />
                                            <span>{new Date(timestamp).toLocaleDateString()}</span>
                                            <span>By Ayush</span>
                                        </div>
                                    </div>
                                    <div className="arrow">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
