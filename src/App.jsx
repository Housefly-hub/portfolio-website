import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, MessageCircle, Code, Server, BrainCircuit, PenTool, Trash2 } from 'lucide-react';
// Firebase imports
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";


// HELPER: A simple component to render icons by name
const Icon = ({ name, ...props }) => {
  switch (name) {
    case 'Mail': return <Mail {...props} />;
    case 'Github': return <Github {...props} />;
    case 'Linkedin': return <Linkedin {...props} />;
    case 'MessageCircle': return <MessageCircle {...props} />;
    case 'Code': return <Code {...props} />;
    case 'Server': return <Server {...props} />;
    case 'BrainCircuit': return <BrainCircuit {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'Trash2': return <Trash2 {...props} />;
    default: return null;
  }
};

// --- CORE COMPONENTS ---

const Header = () => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" onClick={() => window.location.hash = ''} className="text-4xl font-bold text-white hover:text-amber-400 transition-colors">
          Deepak Yadav</a>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#about" onClick={() => scrollTo('about')} className="text-slate-300 hover:text-amber-400 transition-colors">About</a>
          <a href="#resume" onClick={() => scrollTo('resume')} className="text-slate-300 hover:text-amber-400 transition-colors">Resume</a>
          <a href="#projects" onClick={() => scrollTo('projects')} className="text-slate-300 hover:text-amber-400 transition-colors">Projects</a>
          <a href="#contact" onClick={() => scrollTo('contact')} className="text-slate-300 hover:text-amber-400 transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
};

const HeroSection = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center text-center bg-slate-900 text-white pt-20">
            <div className="container mx-auto px-6">
                <div className="w-64 h-64 mx-auto mb-8 border-2 border-dashed border-amber-500/30 rounded-full flex items-center justify-center">
                    <p className="text-amber-500/50 text-sm">3D Animation</p>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                    Technology Enthusiast & Innovator
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-300 mb-8">
                    Specializing in Robotics, Automation, and Embedded Systems.
                </p>
                <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }); }}
                   className="inline-block bg-amber-500 text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-400 transition-all transform hover:scale-105">
                    Explore My Work
                </a>
            </div>
        </section>
    );
};

const AboutSection = () => (
  <section id="about" className="py-24 bg-slate-800">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-white mb-12">About Me</h2>
      <div className="max-w-3xl mx-auto text-center text-slate-300 text-lg leading-relaxed">
        <p>
          I am a 4th year Robotics and Automation student at Government Engineering College, Rajkot. I am  a technology enthusiast with a deep passion for robotics, automation, and the world of embedded systems. My journey is driven by a desire to understand how things work and to build solutions that bridge the gap between digital and physical worlds. I have a foundational understanding of machine learning and enjoy applying it to create intelligent systems.
        </p>
      </div>
    </div>
  </section>
);

const ResumeSection = () => {
    const resumeData = [
        { year: '2023-Present', title: 'B.E in Robotics and Automation', institution: 'Government Engineering College, Rajkot', description: 'Focusing on control systems, machine vision, and autonomous navigation.' },
        { year: '2022', title: 'Machine Learning Project', institution: 'Personal Project', description: 'Developed a predictive model for sensor data analysis in a simulated robotic arm.' },
        { year: '2021', title: 'Internship', institution: 'Regional Science Centre, Rajkot', description: 'Designed and implemented a cylindrical Pick and Place Robot'},
    ];

    return (
        <section id="resume" className="py-24 bg-slate-900">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-16">Interactive Resume</h2>
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-700"></div>
                    {resumeData.map((item, index) => (
                        <div key={index} className={`mb-12 flex items-center w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className="w-1/2"></div>
                            <div className="w-1/2 px-4">
                                <div className={`p-6 rounded-lg shadow-lg bg-slate-800 border border-slate-700 transform transition-all duration-500 hover:border-amber-500 hover:scale-105 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                                    <p className="text-amber-400 font-semibold mb-1">{item.year}</p>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-400 text-sm mb-3">{item.institution}</p>
                                    <p className="text-slate-300">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ ...doc.data(), id: doc.id });
            });
            setProjects(projectsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section id="projects" className="py-24 bg-slate-800">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-12">My Projects</h2>
                {loading && <p className="text-center text-white">Loading projects...</p>}
                {!loading && projects.length === 0 && (
                    <p className="text-center text-slate-400">No projects added yet. Check back soon!</p>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <div key={project.id} className="bg-slate-900/50 rounded-lg shadow-xl overflow-hidden group border border-transparent hover:border-amber-500 transition-all duration-300 flex flex-col">
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-slate-300 mb-4">{project.description}</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="flex items-center justify-start space-x-2">
                                    {project.codeUrl && <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="text-sm bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition-colors">Code</a>}
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition-colors">Live Site</a>}
                                    {project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors">Watch Demo</a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ContactSection = () => {
    const contacts = [
        { name: 'Github', icon: 'Github', url: 'https://github.com/your-username', handle: '@your-username' },
        { name: 'Linkedin', icon: 'Linkedin', url: 'https://linkedin.com/in/your-profile', handle: 'Your Name' },
        { name: 'WhatsApp', icon: 'MessageCircle', url: 'https://wa.me/yourphonenumber', handle: 'Message Me' },
        { name: 'Email', icon: 'Mail', url: 'mailto:your.email@example.com', handle: 'your.email@example.com' },
    ];

    return (
        <section id="contact" className="py-24 bg-slate-900">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center text-white mb-4">Get In Touch</h2>
                <p className="text-center text-slate-300 max-w-2xl mx-auto mb-12">
                    I'm open to discussing new projects and opportunities. Feel free to reach out.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contacts.map(contact => (
                        <a key={contact.name} href={contact.url} target="_blank" rel="noopener noreferrer"
                           className="bg-slate-800 p-6 rounded-lg text-center group hover:bg-slate-700 transition-colors transform hover:-translate-y-1">
                            <Icon name={contact.icon} className="w-10 h-10 mx-auto mb-4 text-amber-400" />
                            <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                            <p className="text-slate-400 group-hover:text-amber-400 transition-colors">{contact.handle}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="container mx-auto px-6 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} [Your Name]. All Rights Reserved.</p>
            <p className="text-sm mt-2">Built with React, Firebase, and a passion for technology.</p>
        </div>
    </footer>
);

// --- PAGE COMPONENTS ---

const HomePage = () => (
    <div className="bg-slate-900">
        <Header />
        <main>
            <HeroSection />
            <AboutSection />
            <ResumeSection />
            <ProjectsSection />
            <ContactSection />
        </main>
        <Footer />
    </div>
);

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError('Failed to log in. Please check your email and password.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white">Admin Login</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm rounded-t-md"
                                   placeholder="Email address" />
                        </div>
                        <div>
                            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm rounded-b-md"
                                   placeholder="Password" />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-800 disabled:bg-amber-800 disabled:cursor-not-allowed">
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                 <p className="text-center text-sm text-slate-400">
                    <a href="#" onClick={() => window.location.hash = ''} className="font-medium text-amber-500 hover:text-amber-400">
                        &larr; Back to Portfolio
                    </a>
                </p>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [codeUrl, setCodeUrl] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ ...doc.data(), id: doc.id });
            });
            setProjects(projectsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("Please fill in at least title and description.");
            return;
        }
        try {
            await addDoc(collection(db, "projects"), {
                title,
                description,
                codeUrl,
                liveUrl,
                videoUrl,
                createdAt: new Date()
            });
            // Reset form
            setTitle(''); setDescription(''); setCodeUrl(''); setLiveUrl(''); setVideoUrl('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add project.");
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteDoc(doc(db, "projects", id));
            } catch (error) {
                console.error("Error removing document: ", error);
                alert("Failed to delete project.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen text-white p-4 md:p-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Logout
                    </button>
                </div>

                {/* Add Project Form */}
                <div className="bg-slate-800 p-6 rounded-lg mb-12">
                    <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                    <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 border-transparent"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="3" className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 border-transparent"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Code URL (GitHub)</label>
                            <input type="url" value={codeUrl} onChange={e => setCodeUrl(e.target.value)} className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 border-transparent"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Live Site URL</label>
                            <input type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 border-transparent"/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Video Demo URL (YouTube, etc.)</label>
                            <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-slate-700 text-white rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 border-transparent"/>
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button type="submit" className="bg-amber-600 px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold">Add Project</button>
                        </div>
                    </form>
                </div>

                {/* Project List */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
                    <div className="space-y-4">
                        {loading && <p>Loading projects...</p>}
                        {projects.map(project => (
                            <div key={project.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                                <p className="text-white font-semibold">{project.title}</p>
                                <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-400">
                                    <Icon name="Trash2" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
    const [route, setRoute] = useState('home');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/', '');
            if (hash === 'admin') {
                if (user) {
                    setRoute('adminDashboard');
                } else {
                    setRoute('adminLogin');
                }
            } else {
                setRoute('home');
            }
        };

        if (!loading) {
            handleHashChange();
            window.addEventListener('hashchange', handleHashChange);
        }

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [user, loading]);

    if (loading) {
        return (
            <div className="bg-slate-900 min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }
    
    const renderRoute = () => {
        switch (route) {
            case 'adminLogin':
                return <AdminLoginPage />;
            case 'adminDashboard':
                return <AdminDashboard />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="antialiased">
            {renderRoute()}
        </div>
    );
}
