/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Settings, 
  MoreVertical, 
  Scan, 
  Wand2, 
  Plus, 
  Home, 
  Files, 
  Camera, 
  Wrench,
  Sparkles,
  Star,
  ChevronDown,
  ChevronRight,
  Folder,
  ArrowUpDown,
  Menu,
  StickyNote,
  Settings2,
  Moon,
  Sun,
  FileText,
  FileCode,
  FileImage,
  Lock,
  Unlock,
  Merge,
  Scissors,
  RotateCw,
  Trash2,
  Type,
  PenTool,
  Share2,
  Download,
  History,
  ShieldCheck,
  Zap,
  LayoutGrid,
  List,
  SortAsc,
  PlusCircle,
  Filter,
  FolderPlus,
  Move,
  X,
  Pencil,
  Highlighter,
  Type as TypeIcon,
  Square,
  Circle,
  Eraser,
  MessageSquare,
  Undo,
  Redo,
  Save,
  Maximize2,
  ChevronLeft
} from "lucide-react";

// --- Types ---
interface FileItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  type: string;
}

interface VaultFolder {
  id: string;
  name: string;
  count: number;
  lastUpdated: string;
  subfolders?: { name: string; count: number }[];
}

// --- Mock Data ---
const RECENT_FILES: FileItem[] = [
  { id: "1", title: "Q3_Strategic_Plan_Draft.pdf", subtitle: "MODIFIED 2H AGO • 12.4 MB", thumbnail: "https://picsum.photos/seed/plan/200/200", type: "PDF" },
  { id: "2", title: "Identity_Guidelines_Final.pdf", subtitle: "MODIFIED 5H AGO • 45.2 MB", thumbnail: "https://picsum.photos/seed/identity/200/200", type: "PDF" },
  { id: "3", title: "Research_Paper_Annotated.pdf", subtitle: "MODIFIED YESTERDAY • 2.8 MB", thumbnail: "https://picsum.photos/seed/research/200/200", type: "PDF" },
  { id: "4", title: "Real_Estate_Portfolio.pdf", subtitle: "MODIFIED 2 DAYS AGO • 8.1 MB", thumbnail: "https://picsum.photos/seed/estate/200/200", type: "PDF" },
];

const VAULT_DATA: VaultFolder[] = [
  { 
    id: "v1", 
    name: "Project Alpha", 
    count: 14, 
    lastUpdated: "LAST UPDATED 2H AGO",
    subfolders: [
      { name: "Drafts", count: 4 },
      { name: "Approved", count: 8 },
      { name: "Resources", count: 2 },
    ]
  },
  { id: "v2", name: "Finance", count: 32, lastUpdated: "SHARED ACCESS" },
  { id: "v3", name: "Marketing Assets", count: 156, lastUpdated: "EXTERNAL SYNC" },
];

// --- Hooks ---
const useLongPress = (callback: () => void, ms = 500) => {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (startLongPress) {
      timerRef.current = setTimeout(callback, ms);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startLongPress, callback, ms]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
};

// --- Components ---

const DocumentViewer = ({ file, onBack }: { file: FileItem, onBack: () => void }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [color, setColor] = useState("#448AFF");
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  const tools = [
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'text', icon: TypeIcon, label: 'Text' },
    { id: 'shape', icon: Square, label: 'Shape' },
    { id: 'note', icon: MessageSquare, label: 'Note' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  const colors = ["#448AFF", "#FFD60A", "#FF3B30", "#34C759", "#AF52DE", "#FFFFFF"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[200] bg-bg flex flex-col"
    >
      {/* Viewer Header */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-bold truncate max-w-[150px]">{file.title}</h2>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Page 1 of 12</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-text-secondary hover:bg-white/5 rounded-full">
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:bg-white/5 rounded-full">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:bg-white/5 rounded-full">
            <Save className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Document Area */}
      <main className="flex-1 overflow-auto bg-[#252525] p-4 flex flex-col items-center relative no-scrollbar">
        <div className="w-full max-w-2xl bg-white shadow-2xl rounded-sm min-h-[1000px] relative overflow-hidden mb-20">
          <img 
            src={file.thumbnail} 
            alt="Document Page" 
            className="w-full opacity-10 blur-3xl absolute inset-0 scale-150"
            referrerPolicy="no-referrer"
          />
          <div className="relative p-12 text-gray-800 font-serif leading-relaxed">
            <h1 className="text-3xl font-bold mb-8 text-black">{file.title.replace('.pdf', '')}</h1>
            <p className="mb-6">
              This document contains strategic analysis and projections for the upcoming fiscal quarter. 
              The primary focus remains on sustainable growth and operational efficiency across all departments.
            </p>
            <div className="h-40 bg-gray-100 rounded-xl mb-8 flex items-center justify-center border-2 border-dashed border-gray-200">
              <FileImage className="w-12 h-12 text-gray-300" />
            </div>
            <p className="mb-6">
              Market trends indicate a significant shift towards AI-integrated workflows. Our roadmap 
              prioritizes the implementation of these technologies to maintain a competitive edge.
            </p>
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-5/6 bg-gray-100 rounded" />
            </div>
          </div>

          {/* Simulated Annotations */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-[280px] left-[120px] w-[200px] h-6 bg-yellow-400/30 border-b-2 border-yellow-400/50"
            />
            <div className="absolute top-[450px] left-[80px] p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[10px] text-blue-600 font-bold">
              NEEDS REVIEW
            </div>
          </div>
        </div>

        {/* Page Navigation Slider */}
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-64 bg-black/60 backdrop-blur-xl rounded-full p-2 flex items-center gap-3 border border-white/10 shadow-2xl z-[210]">
          <span className="text-[10px] font-bold text-white ml-2">1</span>
          <div className="flex-1 h-1 bg-white/20 rounded-full relative">
            <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-primary rounded-full" />
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
          </div>
          <span className="text-[10px] font-bold text-white mr-2">12</span>
        </div>

        {/* AI Smart Panel */}
        <AnimatePresence>
          {isAIPanelOpen && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-card/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Insights
                </h3>
                <button onClick={() => setIsAIPanelOpen(false)} className="p-1 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Summary</p>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    This document outlines a strategic shift towards AI integration, focusing on Q4 revenue projections and market sustainability.
                  </p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Key Entities</p>
                  <div className="flex flex-wrap gap-2">
                    {['Strategic Plan', 'Q4 Projections', 'AI Roadmap'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20">
                  ASK AI A QUESTION
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Annotation Toolbar */}
      <footer className="pb-8 pt-4 px-4 bg-card/80 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex gap-1">
              <button className="p-2 text-text-secondary hover:bg-white/5 rounded-lg">
                <Undo className="w-5 h-5" />
              </button>
              <button className="p-2 text-text-secondary hover:bg-white/5 rounded-lg">
                <Redo className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              {colors.map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-around bg-white/5 rounded-2xl p-2 border border-white/5">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${activeTool === tool.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-white'}`}
              >
                <tool.icon className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

const TopBar = ({ title, isDarkMode, toggleTheme }: { title: string, isDarkMode: boolean, toggleTheme: () => void }) => (
  <header className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
        <FileText className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-primary tracking-tight leading-none">ProPDF</h1>
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{title}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-card-hover rounded-full transition-colors">
        <Search className="w-5 h-5 text-text-secondary" />
      </button>
      <button 
        onClick={toggleTheme}
        className="p-2 hover:bg-card-hover rounded-full transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-text-secondary" />
        ) : (
          <Moon className="w-5 h-5 text-text-secondary" />
        )}
      </button>
      <button className="p-2 hover:bg-card-hover rounded-full transition-colors">
        <Settings className="w-5 h-5 text-text-secondary" />
      </button>
    </div>
  </header>
);

const Tooltip = ({ text, children }: { text: string, children: ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full mb-3 z-[100] w-40 p-2.5 bg-card/90 backdrop-blur-xl text-white text-[10px] font-medium rounded-xl shadow-2xl pointer-events-none text-center border border-white/10 leading-tight"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolsView = () => {
  const toolGroups = [
    {
      title: "Edit & Organize",
      tools: [
        { name: "Merge PDF", icon: Merge, color: "bg-blue-500", desc: "Combine multiple PDF files into one." },
        { name: "Split PDF", icon: Scissors, color: "bg-orange-500", desc: "Separate a PDF into multiple documents." },
        { name: "Rotate", icon: RotateCw, color: "bg-green-500", desc: "Change the orientation of PDF pages." },
        { name: "Delete Pages", icon: Trash2, color: "bg-red-500", desc: "Remove specific pages from a PDF." },
      ]
    },
    {
      title: "Convert",
      tools: [
        { name: "PDF to Word", icon: FileText, color: "bg-blue-600", desc: "Convert PDF documents to editable Word files." },
        { name: "PDF to Image", icon: FileImage, color: "bg-purple-500", desc: "Extract pages from a PDF as high-quality images." },
        { name: "Image to PDF", icon: Camera, color: "bg-pink-500", desc: "Create a PDF from your photos or scans." },
        { name: "OCR Text", icon: Type, color: "bg-yellow-500", desc: "Recognize and extract text from scanned PDFs." },
      ]
    },
    {
      title: "Security & Sign",
      tools: [
        { name: "Sign PDF", icon: PenTool, color: "bg-indigo-500", desc: "Add your digital signature to any PDF." },
        { name: "Protect", icon: Lock, color: "bg-slate-700", desc: "Secure your PDF with a password." },
        { name: "Unlock", icon: Unlock, color: "bg-emerald-500", desc: "Remove passwords and restrictions from PDFs." },
        { name: "Redact", icon: ShieldCheck, color: "bg-rose-600", desc: "Permanently hide sensitive information." },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-10"
    >
      <div className="grid grid-cols-1 gap-8">
        {toolGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 ml-1">{group.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {group.tools.map((tool, tIdx) => (
                <div key={tIdx}>
                  <Tooltip text={tool.desc}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex flex-col p-5 bg-card rounded-3xl text-left border border-white/5 shadow-xl hover:bg-card-hover transition-all"
                      aria-label={`${tool.name}: ${tool.desc}`}
                    >
                      <div className={`w-10 h-10 mb-4 flex items-center justify-center rounded-xl ${tool.color} shadow-lg shadow-blue-500/20`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-sm">{tool.name}</h4>
                      <p className="text-[10px] text-text-secondary mt-1">Premium Tool</p>
                    </motion.button>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ScanView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-10"
  >
    <div className="w-full aspect-[3/4] bg-card rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
      <Camera className="w-16 h-16 text-text-secondary mb-4" />
      <p className="text-text-secondary text-sm font-medium">Position document within frame</p>
      
      {/* Corner markers */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
    </div>
    
    <div className="flex gap-6">
      <button className="w-16 h-16 rounded-full bg-card border border-white/10 flex items-center justify-center">
        <Folder className="w-6 h-6 text-text-secondary" />
      </button>
      <button className="w-20 h-20 rounded-full bg-primary border-4 border-white/20 flex items-center justify-center shadow-2xl shadow-primary/40">
        <div className="w-16 h-16 rounded-full border-2 border-white/50" />
      </button>
      <button className="w-16 h-16 rounded-full bg-card border border-white/10 flex items-center justify-center">
        <Zap className="w-6 h-6 text-yellow-500" />
      </button>
    </div>
  </motion.div>
);

const ViewOptions = ({ 
  viewMode, 
  setViewMode, 
  sortOrder, 
  setSortOrder,
  showAddCategory = false,
  onAddCategory
}: { 
  viewMode: "list" | "grid", 
  setViewMode: (m: "list" | "grid") => void,
  sortOrder: string,
  setSortOrder: (s: string) => void,
  showAddCategory?: boolean,
  onAddCategory?: () => void
}) => (
  <div className="flex items-center justify-between mb-4 px-1">
    <div className="flex items-center gap-3">
      <div className="relative group">
        <button className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:text-primary transition-colors">
          <SortAsc className="w-4 h-4" />
          {sortOrder}
        </button>
        <div className="absolute top-full left-0 mt-2 w-32 bg-card border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
          {["Name", "Date", "Size"].map((option) => (
            <button 
              key={option}
              onClick={() => setSortOrder(option)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 ${sortOrder === option ? "text-primary" : "text-text-secondary"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="h-3 w-[1px] bg-white/10" />
      <button 
        onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        className="text-text-secondary hover:text-primary transition-colors"
      >
        {viewMode === "list" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
      </button>
    </div>
    
    {showAddCategory && (
      <button 
        onClick={onAddCategory}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        New Category
      </button>
    )}
  </div>
);

const FileCard = ({ 
  file, 
  viewMode = "list",
  onClick,
  onLongPress
}: { 
  file: FileItem, 
  viewMode?: "list" | "grid",
  onClick?: () => void,
  onLongPress?: () => void
}) => {
  const longPressProps = useLongPress(onLongPress || (() => {}));

  return (
    <motion.div 
      layout
      {...longPressProps}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-card rounded-2xl cursor-pointer hover:bg-card-hover transition-colors group relative border border-white/5 ${
        viewMode === "list" ? "flex items-center gap-4 p-4 mb-3" : "flex flex-col p-3"
      }`}
    >
      <div className={`${viewMode === "list" ? "w-16 h-16" : "w-full aspect-square mb-3"} rounded-xl overflow-hidden flex-shrink-0 relative`}>
        <img 
          src={file.thumbnail} 
          alt={file.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {viewMode === "grid" && (
          <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold truncate ${viewMode === "list" ? "text-base" : "text-xs"}`}>{file.title}</h3>
        <div className={`flex items-center gap-2 mt-1 ${viewMode === "grid" ? "flex-wrap" : ""}`}>
          <span className="px-1.5 py-0.5 text-[8px] font-bold text-tag-text bg-tag-bg rounded uppercase">
            {file.type}
          </span>
          <span className="text-[9px] text-text-secondary uppercase tracking-wider truncate">
            {file.subtitle.split(' • ')[0]}
          </span>
        </div>
      </div>
      {viewMode === "list" && (
        <button className="p-2 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};

const FilesView = ({ recentFiles, viewMode, setViewMode, sortOrder, setSortOrder }: { 
  recentFiles: FileItem[], 
  viewMode: "list" | "grid", 
  setViewMode: (m: "list" | "grid") => void,
  sortOrder: string,
  setSortOrder: (s: string) => void
}) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full">ALL</button>
        <button className="px-4 py-1.5 bg-card text-text-secondary text-xs font-bold rounded-full">PDF</button>
        <button className="px-4 py-1.5 bg-card text-text-secondary text-xs font-bold rounded-full">DOCS</button>
      </div>
      <button className="p-2 bg-card rounded-xl text-text-secondary">
        <Filter className="w-4 h-4" />
      </button>
    </div>

    <ViewOptions 
      viewMode={viewMode} 
      setViewMode={setViewMode} 
      sortOrder={sortOrder} 
      setSortOrder={setSortOrder} 
    />
    
    <div className={viewMode === "list" ? "space-y-1" : "grid grid-cols-2 gap-4"}>
      {recentFiles.map((file) => (
        <div key={file.id}>
          <FileCard file={file} viewMode={viewMode} />
        </div>
      ))}
      <div key="file-5">
        <FileCard file={{ id: "5", title: "Tax_Return_2025.pdf", subtitle: "MODIFIED 1 WEEK AGO • 1.2 MB", thumbnail: "https://picsum.photos/seed/tax/200/200", type: "PDF" }} viewMode={viewMode} />
      </div>
      <div key="file-6">
        <FileCard file={{ id: "6", title: "Contract_Signed.pdf", subtitle: "MODIFIED 2 WEEKS AGO • 0.5 MB", thumbnail: "https://picsum.photos/seed/contract/200/200", type: "PDF" }} viewMode={viewMode} />
      </div>
    </div>
  </motion.div>
);

const MagicAIView = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col gap-6"
  >
    <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        <Sparkles className="w-12 h-12 text-accent mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Magic AI Assistant</h2>
        <p className="text-indigo-100 text-sm mb-6">Ask questions, summarize, or translate your documents with our advanced AI engine.</p>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-white text-indigo-700 text-xs font-bold rounded-full shadow-lg">GET STARTED</button>
          <button className="px-6 py-2 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md">LEARN MORE</button>
        </div>
      </div>
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>

    <div className="grid grid-cols-1 gap-4">
      {[
        { title: "Smart Summary", desc: "Get key points from any PDF", icon: StickyNote },
        { title: "Document Chat", desc: "Ask questions about your file", icon: Sparkles },
        { title: "AI Translation", desc: "Translate to 50+ languages", icon: Zap },
      ].map((item, i) => (
        <motion.div 
          key={i}
          whileHover={{ x: 4 }}
          className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-white/5 cursor-pointer hover:bg-card-hover transition-all"
        >
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <item.icon className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-bold text-base">{item.title}</h3>
            <p className="text-xs text-text-secondary">{item.desc}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-text-secondary ml-auto" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const SearchBar = () => (
  <div className="relative mb-8">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
    <input 
      type="text" 
      placeholder="Search documents, projects, or tags."
      className="w-full bg-card border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-text-secondary"
    />
  </div>
);

const PremiumBanner = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6 mb-8 shadow-xl"
  >
    <div className="relative z-10">
      <div className="inline-block px-2 py-1 mb-3 text-[10px] font-bold text-white bg-white/20 rounded-lg backdrop-blur-md">
        NEW FEATURE
      </div>
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        AI-Powered Smart Summaries <Sparkles className="w-5 h-5 text-accent" />
      </h2>
      <p className="text-sm text-blue-100 mb-4 max-w-[80%]">
        Extract key insights from lengthy PDFs in seconds using our latest structural analysis engine.
      </p>
      <button className="px-6 py-3 text-sm font-bold text-primary-dark bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg">
        Try Analysis Now
      </button>
    </div>
    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
  </motion.div>
);

const ActiveSession = ({ onContinue }: { onContinue: () => void }) => (
  <div className="mb-8">
    <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">Active Session</h3>
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group cursor-pointer">
      <img 
        src="https://picsum.photos/seed/revenue/800/450" 
        alt="Active Session" 
        className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h4 className="text-2xl font-bold text-white mb-4">Q4_Revenue_Projection</h4>
        <div className="flex items-center justify-between">
          <button 
            onClick={onContinue}
            className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            CONTINUE EDITING
          </button>
          <span className="text-[10px] text-white/60 italic">Edited 5m ago by You</span>
        </div>
      </div>
    </div>
  </div>
);

const VaultFolderCard = ({ 
  folder, 
  onLongPress,
  onRemove
}: { 
  folder: VaultFolder, 
  onLongPress: () => void,
  onRemove: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const longPressProps = useLongPress(onLongPress);

  return (
    <div className="mb-3">
      <motion.div 
        {...longPressProps}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 p-5 bg-card rounded-2xl cursor-pointer hover:bg-card-hover transition-colors relative overflow-hidden"
      >
        <div className="p-3 bg-accent/10 rounded-xl">
          <Folder className="w-6 h-6 text-accent fill-accent/20" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold">{folder.name}</h3>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
            {folder.count} DOCUMENTS • {folder.lastUpdated}
          </p>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-text-secondary" /> : <ChevronRight className="w-5 h-5 text-text-secondary" />}
      </motion.div>
      
      <AnimatePresence>
        {isOpen && folder.subfolders && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-6 mt-2 space-y-2"
          >
            {folder.subfolders.map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Folder className="w-4 h-4 text-accent/60" />
                  <span className="text-sm font-medium">{sub.name}</span>
                </div>
                <span className="text-xs text-text-secondary font-bold">{sub.count}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Tabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = ["Recent", "Starred", "Categories"];
  return (
    <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === tab 
              ? "bg-card text-primary font-bold shadow-lg" 
              : "text-text-secondary hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const QuickActions = ({ onMagicClick }: { onMagicClick: () => void }) => (
  <section className="mb-12">
    <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      <motion.button 
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col p-6 bg-card rounded-3xl text-left hover:bg-card-hover transition-all shadow-lg border border-white/5"
      >
        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-blue-500/10 rounded-2xl">
          <Scan className="w-7 h-7 text-blue-500" />
        </div>
        <h3 className="font-bold text-base mb-1">Scan Document</h3>
        <p className="text-xs text-text-secondary leading-tight">Convert physical to PDF instantly</p>
      </motion.button>
      <motion.button 
        onClick={onMagicClick}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col p-6 bg-card rounded-3xl text-left hover:bg-card-hover transition-all shadow-lg border border-white/5"
      >
        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-500/10 rounded-2xl">
          <Wand2 className="w-7 h-7 text-purple-500" />
        </div>
        <h3 className="font-bold text-base mb-1">Magic AI Edit</h3>
        <p className="text-xs text-text-secondary leading-tight">Summarize and extract data</p>
      </motion.button>
    </div>
  </section>
);

const BottomNav = ({ active, setActive }: { active: string, setActive: (s: string) => void }) => {
  const items = [
    { id: "home", label: "HOME", icon: Home },
    { id: "files", label: "FILES", icon: Files },
    { id: "fab", label: "OPEN", icon: Plus }, 
    { id: "scan", label: "SCAN", icon: Scan },
    { id: "tools", label: "TOOLS", icon: Wrench },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 z-50 pointer-events-none">
      <div className="absolute bottom-0 w-full h-20 bg-card/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] flex items-center justify-around px-4 pointer-events-auto border-t border-white/5">
        {items.map((item) => {
          if (item.id === "fab") return <div key="spacer" className="w-16" />;
          const Icon = item.icon!;
          const isSelected = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex flex-col items-center justify-center gap-1.5 group transition-all"
            >
              <div className={`p-2 rounded-xl transition-all ${isSelected ? "bg-primary/10" : ""}`}>
                <Icon className={`w-6 h-6 transition-colors ${isSelected ? "text-primary" : "text-text-secondary group-hover:text-primary/80"}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-wider transition-colors ${isSelected ? "text-primary" : "text-text-secondary group-hover:text-primary/80"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Floating Action Button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            // Mock file open
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf';
            input.click();
          }}
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 z-10 border-4 border-bg"
        >
          <Plus className="w-8 h-8 text-white" />
        </motion.button>
        <span className="text-[10px] font-bold text-text-secondary tracking-widest">OPEN</span>
      </div>
    </div>
  );
};

export default function App() {
  const [activeNav, setActiveNav] = useState("home");
  const [activeTab, setActiveTab] = useState("Recent");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortOrder, setSortOrder] = useState("Date");
  const [categories, setCategories] = useState(VAULT_DATA);
  const [contextMenu, setContextMenu] = useState<{ type: 'category' | 'file', id: string, name?: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  const handleOpenFile = (file: FileItem) => {
    setSelectedFile(file);
    setActiveNav("viewer");
  };

  const handleAddCategory = () => {
    const name = prompt("Enter category name:");
    if (name) {
      const newCategory: VaultFolder = {
        id: `v${Date.now()}`,
        name,
        count: 0,
        lastUpdated: "JUST NOW"
      };
      setCategories([newCategory, ...categories]);
    }
  };

  const handleAddSubcategory = (categoryId: string) => {
    const name = prompt("Enter subcategory name:");
    if (name) {
      setCategories(categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subfolders: [...(cat.subfolders || []), { name, count: 0 }]
          };
        }
        return cat;
      }));
    }
    setContextMenu(null);
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to remove this category?")) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
    setContextMenu(null);
  };

  const handleMoveToFile = (fileId: string, targetCategory: string, subName?: string) => {
    alert(`Moving file ${fileId} to ${targetCategory}${subName ? ` > ${subName}` : ''}`);
    setContextMenu(null);
  };

  const renderContent = () => {
    switch (activeNav) {
      case "home":
        return (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {activeTab === "Categories" && <SearchBar />}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <AnimatePresence mode="wait">
              {activeTab === "Recent" && (
                <motion.div 
                  key="recent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <PremiumBanner />
                  <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold tracking-tight">Recent Files</h2>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Editor V4.2</span>
                    </div>

                    <ViewOptions 
                      viewMode={viewMode} 
                      setViewMode={setViewMode} 
                      sortOrder={sortOrder} 
                      setSortOrder={setSortOrder} 
                    />

                    <div className={viewMode === "list" ? "flex flex-col" : "grid grid-cols-2 gap-4"}>
                      {RECENT_FILES.map((file) => (
                        <div key={file.id}>
                          <FileCard 
                            file={file} 
                            viewMode={viewMode} 
                            onClick={() => handleOpenFile(file)}
                            onLongPress={() => setContextMenu({ type: 'file', id: file.id, name: file.title })}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                  <QuickActions onMagicClick={() => setActiveNav("magic")} />
                </motion.div>
              )}

              {activeTab === "Categories" && (
                <motion.div 
                  key="categories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <section className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-3xl font-bold tracking-tight">Vault</h2>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">V2.4.0_STABLE</span>
                    </div>

                    <ViewOptions 
                      viewMode={viewMode} 
                      setViewMode={setViewMode} 
                      sortOrder={sortOrder} 
                      setSortOrder={setSortOrder}
                      showAddCategory={true}
                      onAddCategory={handleAddCategory}
                    />

                    <div className="flex flex-col">
                      {categories.map((folder) => (
                        <div key={folder.id}>
                          <VaultFolderCard 
                            folder={folder} 
                            onLongPress={() => setContextMenu({ type: 'category', id: folder.id, name: folder.name })}
                            onRemove={() => handleRemoveCategory(folder.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                  <ActiveSession onContinue={() => handleOpenFile(RECENT_FILES[0])} />
                </motion.div>
              )}

              {activeTab === "Starred" && (
                <motion.div 
                  key="starred"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold tracking-tight">Starred</h2>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">FAVORITES</span>
                  </div>

                  <ViewOptions 
                    viewMode={viewMode} 
                    setViewMode={setViewMode} 
                    sortOrder={sortOrder} 
                    setSortOrder={setSortOrder} 
                  />

                  <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-10 h-10 text-text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Starred Files</h3>
                    <p className="text-text-secondary text-sm">Mark important documents to find them here.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case "files":
        return (
          <FilesView 
            recentFiles={RECENT_FILES} 
            viewMode={viewMode} 
            setViewMode={setViewMode}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        );
      case "scan":
        return <ScanView />;
      case "tools":
        return <ToolsView />;
      case "magic":
        return <MagicAIView />;
      case "viewer":
        return selectedFile ? (
          <DocumentViewer 
            file={selectedFile} 
            onBack={() => {
              setSelectedFile(null);
              setActiveNav("home");
            }} 
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen max-w-md mx-auto px-5 pt-8 pb-32 relative transition-colors duration-300 ${isDarkMode ? "bg-bg text-white" : "bg-white text-gray-900"}`}>
      <TopBar title={activeNav.toUpperCase()} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <BottomNav active={activeNav} setActive={setActiveNav} />

      {/* Context Menu Modal */}
      <AnimatePresence>
        {contextMenu && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-card rounded-t-[32px] p-6 pb-10 shadow-2xl border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{contextMenu.name}</h3>
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-widest mt-1">
                    {contextMenu.type === 'category' ? 'Category Options' : 'File Options'}
                  </p>
                </div>
                <button 
                  onClick={() => setContextMenu(null)}
                  className="p-2 bg-white/5 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {contextMenu.type === 'category' ? (
                  <>
                    <button 
                      onClick={() => handleAddSubcategory(contextMenu.id)}
                      className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                      <FolderPlus className="w-5 h-5 text-primary" />
                      <span className="font-bold">Add Subcategory</span>
                    </button>
                    <button 
                      onClick={() => handleRemoveCategory(contextMenu.id)}
                      className="w-full flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-red-500">Remove Category</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Move to Category</p>
                      <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
                        {categories.map(cat => (
                          <div key={cat.id} className="space-y-1">
                            <button 
                              onClick={() => handleMoveToFile(contextMenu.id, cat.name)}
                              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Folder className="w-4 h-4 text-accent" />
                                <span className="text-sm font-bold">{cat.name}</span>
                              </div>
                              <Move className="w-4 h-4 text-text-secondary" />
                            </button>
                            {cat.subfolders?.map(sub => (
                              <button 
                                key={sub.name}
                                onClick={() => handleMoveToFile(contextMenu.id, cat.name, sub.name)}
                                className="w-full flex items-center justify-between p-3 ml-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border-l-2 border-primary/20"
                              >
                                <div className="flex items-center gap-3">
                                  <Folder className="w-3.5 h-3.5 text-accent/60" />
                                  <span className="text-xs font-medium">{sub.name}</span>
                                </div>
                                <Move className="w-3.5 h-3.5 text-text-secondary" />
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        alert("File removed");
                        setContextMenu(null);
                      }}
                      className="w-full flex items-center gap-4 p-4 bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-red-500">Remove File</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
