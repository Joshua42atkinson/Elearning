import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Layers, Video, FileText, CheckCircle2, Gamepad2 } from 'lucide-react';
import HomePage from './pages/HomePage';
import ModuleOne from './pages/ModuleOne';
import ModuleTwo from './pages/ModuleTwo';
import ModuleThree from './pages/ModuleThree';
import SandboxEmbed from './pages/SandboxEmbed';
import KnowledgeCheck from './pages/KnowledgeCheck';
import Documentation from './pages/Documentation';

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getProgressWidth = () => {
    switch (currentPath) {
      case '/': return '0%';
      case '/module-1': return '20%';
      case '/module-2': return '35%';
      case '/module-3': return '50%';
      case '/sandbox': return '65%';
      case '/knowledge-check': return '85%';
      case '/documentation': return '100%';
      default: return '0%';
    }
  };

  const navItems = [
    { name: 'Intro', path: '/', icon: <Home size={18} /> },
    { name: 'Mod 1: Setup', path: '/module-1', icon: <Layers size={18} /> },
    { name: 'Mod 2: Logic', path: '/module-2', icon: <Video size={18} /> },
    { name: 'Mod 3: Implement', path: '/module-3', icon: <Video size={18} /> },
    { name: 'Sandbox', path: '/sandbox', icon: <Gamepad2 size={18} /> },
    { name: 'Quiz', path: '/knowledge-check', icon: <CheckCircle2 size={18} /> },
    { name: 'Docs', path: '/documentation', icon: <FileText size={18} /> },
  ];

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">L</span>
              Local AI Architect
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${currentPath === item.path
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-800/50">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(139,92,246,0.6)]"
          style={{ width: getProgressWidth() }}
        ></div>
      </div>
    </nav>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="relative z-10 w-full min-h-screen">
        <Navigation />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/module-1" element={<ModuleOne />} />
            <Route path="/module-2" element={<ModuleTwo />} />
            <Route path="/module-3" element={<ModuleThree />} />
            <Route path="/sandbox" element={<SandboxEmbed />} />
            <Route path="/knowledge-check" element={<KnowledgeCheck />} />
            <Route path="/documentation" element={<Documentation />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
