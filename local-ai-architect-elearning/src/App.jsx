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
      case '/module-2': return '40%';
      case '/module-3': return '60%';
      case '/sandbox': return '80%';
      case '/knowledge-check': return '90%';
      case '/documentation': return '100%';
      default: return '0%';
    }
  };

  const getActiveStyles = (path) => {
    if (currentPath !== path) return 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent';

    switch (path) {
      case '/module-1': return 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case '/module-2': return 'bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.3)]';
      case '/module-3': return 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case '/sandbox': return 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]';
      default: return 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]';
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
    <nav className="glass-nav z-50 relative">
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
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${getActiveStyles(item.path)}`}
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
          className="h-full bg-gradient-to-r from-emerald-500 via-fuchsia-500 to-amber-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(139,92,246,0.6)]"
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
