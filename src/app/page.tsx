'use client';
import React, { useEffect, useState, useRef } from "react";

const BOARD_ROWS = 12;
const BOARD_COLS = 8;

// Add more Tetris shapes for variety
const TETROMINOES = [
  { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" }, // I
  { shape: [[1, 1], [1, 1]], color: "bg-yellow-400" }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-purple-500" }, // T
  { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-green-500" }, // S
  { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-red-500" }, // Z
];

type BoardType = (string | null)[][];
type TetrominoType = number[][];

type SequenceItem = { idx: number; col: number; };

function getEmptyBoard(): BoardType {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
}

function placeTetromino(
  board: BoardType,
  tetromino: TetrominoType,
  row: number,
  col: number,
  color: string | null
): BoardType {
  const newBoard = board.map((r) => [...r]);
  tetromino.forEach((tRow, rIdx) => {
    tRow.forEach((cell, cIdx) => {
      if (cell && newBoard[row + rIdx] && newBoard[row + rIdx][col + cIdx] !== undefined) {
        newBoard[row + rIdx][col + cIdx] = color;
      }
    });
  });
  return newBoard;
}

// Helper to get the height of a tetromino
function getTetrominoHeight(tetromino: TetrominoType) {
  return tetromino.length;
}

function TetrisAnimation() {
  const [board, setBoard] = useState<BoardType>(getEmptyBoard());
  const [active, setActive] = useState<{idx: number, row: number, col: number} | null>(null);
  const [step, setStep] = useState(0);

  // Sequence: stack a variety of shapes, filling the board to the top
  const sequence: SequenceItem[] = [
    { idx: 0, col: 2 }, // I
    { idx: 1, col: 3 }, // O
    { idx: 2, col: 2 }, // T
    { idx: 3, col: 2 }, // S
    { idx: 4, col: 3 }, // Z
    { idx: 0, col: 2 }, // I
    { idx: 1, col: 3 }, // O
    { idx: 2, col: 2 }, // T
    { idx: 3, col: 2 }, // S
    { idx: 4, col: 3 }, // Z
  ];

  useEffect(() => {
    if (step >= sequence.length) return;

    const { idx, col } = sequence[step];
    const tetromino = TETROMINOES[idx].shape;
    
    // Calculate where this piece should land based on current board state
    let landingRow = BOARD_ROWS - 1;
    let canPlaceAnywhere = false;
    
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      let canPlace = true;
      for (let r = 0; r < tetromino.length; r++) {
        for (let c = 0; c < tetromino[r].length; c++) {
          if (tetromino[r][c]) {
            const boardRow = row + r;
            const boardCol = col + c;
            if (boardRow >= BOARD_ROWS || boardCol < 0 || boardCol >= BOARD_COLS || 
                (boardRow >= 0 && board[boardRow][boardCol] !== null)) {
              canPlace = false;
              break;
            }
          }
        }
        if (!canPlace) break;
      }
      if (canPlace) {
        landingRow = row;
        canPlaceAnywhere = true;
        break;
      }
    }

    // If we can't place the piece anywhere, stop the animation
    if (!canPlaceAnywhere) {
      return;
    }

    // Animate the piece falling
    let currentRow = 0;
    const fallInterval = setInterval(() => {
      if (currentRow < landingRow) {
        setActive({ idx, row: currentRow, col });
        currentRow++;
      } else {
        // Place the piece
        setBoard(prevBoard => {
          const newBoard = prevBoard.map(row => [...row]);
          for (let r = 0; r < tetromino.length; r++) {
            for (let c = 0; c < tetromino[r].length; c++) {
              if (tetromino[r][c]) {
                const boardRow = landingRow + r;
                const boardCol = col + c;
                if (boardRow >= 0 && boardRow < BOARD_ROWS && boardCol >= 0 && boardCol < BOARD_COLS) {
                  newBoard[boardRow][boardCol] = TETROMINOES[idx].color;
                }
              }
            }
          }
          return newBoard;
        });
        setActive(null);
        clearInterval(fallInterval);
        
        // Move to next piece after a delay
        setTimeout(() => {
          setStep(prev => prev + 1);
        }, 500);
      }
    }, 100);

    return () => clearInterval(fallInterval);
  }, [step, board]);

  // Render the board with the active falling piece
  let displayBoard = board.map((row) => [...row]);
  if (active) {
    displayBoard = placeTetromino(
      displayBoard,
      TETROMINOES[active.idx].shape,
      active.row,
      active.col,
      TETROMINOES[active.idx].color
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-2 shadow-lg border-2 border-gray-700" style={{ width: 40 * BOARD_COLS, height: 32 * BOARD_ROWS }}>
        <div className="grid" style={{ gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`, gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)` }}>
          {displayBoard.flat().map((cell, idx) => (
            <div
              key={idx}
              className={`w-5 h-4 sm:w-8 sm:h-6 border border-gray-800 ${cell ? cell : "bg-gray-800"} transition-all duration-100`}
              style={{ boxSizing: 'border-box' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Section components with smooth appear animations
const Section = ({ id, title, children }: { id: string; title?: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id={id} 
      className={`min-h-screen flex flex-col justify-center items-center w-full px-4 py-16 scroll-mt-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      {title && (
        <h2 className={`text-3xl sm:text-4xl font-bold mb-8 text-white text-center transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {title}
        </h2>
      )}
      <div className={`w-full transition-all duration-700 delay-300 flex flex-col items-center ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
    {children}
      </div>
  </section>
);
};

const navLinks = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Grouped projects data
const groupedProjects = [
  {
    category: "Systems & C",
    projects: [
      {
        title: "Dynamic Memory Allocator",
        date: "February 2025 - March 2025",
        description:
          "Designed and implemented a custom dynamic memory allocator in C, replicating core functionalities of malloc, realloc, and free to gain fine-grained control over memory management and performance. Constructed an explicit free list with boundary tagging, alignment handling, and coalescing logic to efficiently manage memory blocks. Optimized allocation strategy using the first-fit placement policy, demonstrating a deep understanding of low-level memory systems and allocator design.",
        technologies: ["C", "Memory Management", "Systems Programming"],
      },
      {
        title: "Linear Device",
        date: "February 2024 - May 2024",
        description:
          "Developed a custom networked MDADM system in C on Linux to remotely manage JBOD (Just a Bunch of Disks) devices over TCP using a self-designed client-server protocol. Implemented core operations such as mount, read, write, and unmount, with support for 1MB linear addressing and robust byte-level packet assembly and error-checking. Built a caching layer with an LRU replacement policy to optimize read/write latency and maximize cache hit rates. Ensured reliable data transmission by designing multi-call read/write logic to handle partial packets and maintain consistency across networked storage operations.",
        technologies: ["C", "Linux", "Networking", "LRU Cache"],
      },
      {
        title: "C CLI Utility Suite",
        date: "May 2024 - June 2024",
        description:
          "Developed a suite of command-line utilities in C for Linux, including file manipulation, process management, and custom scripting tools. Focused on robust error handling, efficient memory usage, and user-friendly CLI design. Demonstrated proficiency in low-level systems programming and Unix tool conventions.",
        technologies: ["C", "Linux", "CLI", "Systems Programming"],
      },
      {
        title: "C Sender/Receiver Channel",
        date: "April 2024 - May 2024",
        description:
          "Implemented a sender/receiver channel in C supporting both non-blocking and blocking send/receive operations. Designed the channel for concurrent producer/consumer scenarios, using POSIX threads and synchronization primitives to ensure safe, efficient message passing. Explored edge cases for deadlock, starvation, and race conditions.",
        technologies: ["C", "POSIX Threads", "Concurrency", "Non-blocking IO", "Blocking IO"],
      },
      {
        title: "5 Stage Pipeline Processor",
        date: "October 2024 - December 2024",
        description:
          "Designed and implemented a fully functional 5-stage pipelined CPU using Verilog, encompassing instruction fetch, decode, execute, memory access, and write-back stages. Built the processor from the ground up, optimizing performance by implementing hazard detection and handling mechanisms for both data and structural hazards. This project demonstrates a strong grasp of computer architecture, low-level digital design, and efficient pipeline control logic.",
        technologies: ["Verilog", "CPU Design", "Computer Architecture"],
      },
    ],
  },
  {
    category: "Web & Blockchain",
    projects: [
      {
        title: "Group-Payment App",
        date: "April 2025 - Present",
        description:
          "Designed and developed a full-stack blockchain-based group payment app to solve the social pressure of deciding who pays the tab. Built with Solidity smart contracts to enable group formation, voting on a designated payer, and conditional fund disbursement only when a target contribution is reached. Integrated MetaMask for wallet authentication and transaction signing, ensuring secure, user-controlled payments. All transactions and voting records are immutably stored on the blockchain for transparency. The app is deployed using Next.js with a React frontend and a Web3-enabled backend, providing a seamless decentralized experience for collaborative group payments.",
        technologies: ["Solidity", "MetaMask", "Web3", "Next.js", "React", "Blockchain"],
      },
      {
        title: "Eterna | Reddit Filtering App",
        date: "February 2025 - March 2025",
        description:
          "Built a full-stack product recommendation app that filters Reddit discussions to surface high-quality suggestions based on community feedback. Users enter a product-related query, which is processed through the Reddit Scraper API (via RapidAPI) to gather relevant posts. The results are then passed to the OpenAI GPT API using prompt-based filtering to eliminate non-product discussions and rank responses by helpfulness. Non-product or vague queries are also automatically filtered. Deployed with Firebase for real-time database storage and built using React, Next.js, and styled-components for a modern, responsive UI.",
        technologies: ["React", "Next.js", "OpenAI", "Firebase", "RapidAPI", "Styled-components"],
      },
      {
        title: "Flight Application",
        date: "August 2024 - November 2024",
        description:
          "Independently designed and built a fully custom, microservice-based flight application from the ground up—no external APIs or tools used. Developed the Flight Creation microservice in Java using the Spring Framework, engineered the Booking system in C# with ASP.NET and MongoDB, and implemented the Payment microservice using GraphQL with Spring and MySQL. Constructed the entire backend architecture and frontend interface using React, managing all data flow, service communication, and storage logic manually to ensure full control and understanding of the system. This project showcases complete ownership over microservice design, API creation, and full-stack integration.",
        technologies: ["Java", "Spring", "C#", "ASP.NET", "MongoDB", "GraphQL", "MySQL", "React"],
      },
      {
        title: "Course Scheduler",
        date: "October 2023 - December 2023",
        description:
          "Developed a Java-based course scheduler application using a layered architecture, separating concerns across user interface, business logic, and data access layers. Built an interactive GUI for scheduling classes, leveraging Object-Oriented Programming to map each course to its corresponding database table. Enhanced functionality by implementing SQL queries for efficient data retrieval and manipulation, enabling dynamic updates and interaction between the GUI and the backend database.",
        technologies: ["Java", "SQL", "OOP", "GUI"],
      },
    ],
  },
  {
    category: "AI & Data",
    projects: [
      {
        title: "AI-Powered Sleep Recommendation System",
        date: "March 2025 - Present",
        description:
          "Led the development of an AI-powered sleep recommendation system as the team's lead software engineer, combining behavioral sleep science with modern NLP. Conducted research to extract evidence-based sleep guidelines and built a custom dataset to fine-tune Meta's LLaMA 3.2 model using LoRA with Hugging Face's transformers, peft, and PyTorch libraries. ",
        technologies: ["Python", "PyTorch", "Hugging Face", "NLP", "LoRA"],
      },
    ],
  },
  {
    category: "Simulation & Other",
    projects: [
      {
        title: "Autonomous Vacuum Cleaner",
        date: "February 2025 - March 2025",
        description:
          "Developed an autonomous vacuum cleaning simulation using the ACT-R cognitive architecture in Python to model intelligent Roomba-like behavior. Implemented motor and visual module rules to execute swirling cleaning patterns and respond dynamically to collisions with debris or walls. Leveraged ACT-R's visual processing to guide real-time decision-making and adaptive navigation in cluttered environments, simulating human-like perception and action in robotic cleaning tasks. Leveraged HDM to create intelligent recall of debris simulating real human memory accelerating map cleaning speed.",
        technologies: ["Python", "ACT-R", "HDM", "Simulation"],
      },
    ],
  },
];

const categoryImages = {
  "Systems & C": "https://img.icons8.com/ios-filled/100/FFD600/console.png",
  "Web & Blockchain": "https://img.icons8.com/ios-filled/100/FFD600/cloud-network.png",
  "AI & Data": "https://img.icons8.com/ios-filled/100/FFD600/artificial-intelligence.png",
  "Simulation & Other": "https://img.icons8.com/ios-filled/100/FFD600/robot-2.png",
};

function TabbedProjects() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expanded, setExpanded] = useState<null | { group: number; idx: number }>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto">
      {/* Tabs */}
      <div className={`flex flex-row gap-4 justify-center mb-8 overflow-x-auto scrollbar-hide transition-all duration-700 delay-100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {groupedProjects.map((group, idx) => (
          <button
            key={group.category}
            className={`flex flex-col items-center justify-center bg-black/80 border-2 ${selectedTab === idx ? 'border-yellow-400' : 'border-gray-800'} rounded-2xl px-8 py-4 min-w-[140px] max-w-[180px] shadow-lg hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-yellow-400 outline-none`}
            onClick={() => setSelectedTab(idx)}
            tabIndex={0}
            aria-selected={selectedTab === idx}
          >
            <img
              src={categoryImages[group.category as keyof typeof categoryImages]}
              alt={group.category + ' icon'}
              className="w-10 h-10 mb-2 object-contain drop-shadow-lg"
              draggable={false}
            />
            <span className="text-base font-bold text-yellow-300 text-center whitespace-nowrap">{group.category}</span>
          </button>
        ))}
      </div>
      {/* Projects grid for selected tab */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full transition-all duration-700 delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {groupedProjects[selectedTab].projects.map((project, idx) => (
          <button
            key={project.title}
            className="bg-black/70 border border-gray-800 rounded-xl p-6 shadow-lg flex flex-col hover:scale-[1.04] transition-all duration-300 text-left outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
            style={{ zIndex: expanded && expanded.group === selectedTab && expanded.idx === idx ? 50 : 1 }}
            onClick={() => setExpanded({ group: selectedTab, idx })}
            tabIndex={0}
          >
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-lg font-bold text-yellow-300 truncate">{project.title}</span>
              <span className="text-xs text-gray-400">{project.date}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      {/* Modal overlay for expanded project */}
      {expanded !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setExpanded(null)}
        >
          <div
            className="relative bg-black border border-yellow-400 rounded-2xl shadow-2xl p-8 max-w-lg w-[90vw] animate-zoom-in"
            style={{ minHeight: 320 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-200 text-2xl font-bold"
              onClick={() => setExpanded(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col gap-2 mb-2">
              <span className="text-2xl font-bold text-yellow-300">{groupedProjects[expanded.group].projects[expanded.idx].title}</span>
              <span className="text-xs text-gray-400">{groupedProjects[expanded.group].projects[expanded.idx].date}</span>
            </div>
            <p className="text-gray-300 text-base mb-4 whitespace-pre-line">{groupedProjects[expanded.group].projects[expanded.idx].description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {groupedProjects[expanded.group].projects[expanded.idx].technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes zoom-in {
              0% { opacity: 0; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-zoom-in {
              animation: zoom-in 0.25s cubic-bezier(0.7,0,0.3,1);
            }
            @keyframes fade-in {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.4s cubic-bezier(0.7,0,0.3,1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

const experienceEntries = [
  {
    date: "June 2025 - Present",
    title: "Software Engineering Intern",
    company: "Staples",
    logo: "https://1000logos.net/wp-content/uploads/2022/03/Staples-Logo.png",
    color: "red", // Staples red
    description:
      "Worked in AGILE team of over 15 engineers. Wrote RESTFUL APIs that combined data from Approvals and Checkout orders. Developed dashboard allowing engineers to directly modify orders status for client conflict resolution. Dashboard sped up customer order resolution by 87% for order error problems.",
  },
  {
    date: "March 2024 - Present",
    title: "Computer Science Tutor",
    company: "Penn State University, College of Engineering",
    logo: "https://brand.psu.edu/images/backgrounds/athletic-reverse.png",
    color: "blue", // Penn State blue
    description:
      "Tutor students in subjects ranging from data structures and algorithms to systems programming and discrete mathematics",
  },
  {
    date: "May 2024 - July 2024",
    title: "SURE Intern",
    company: "Amazon & GT",
    logo: "https://assets.amazon.science/fb/1c/07d25693486eb3d6b49091864af7/amazonscience-squidink.svg",
    color: "orange", // Amazon orange
    description:
      "One of seven students selected to go work in Metz, France in the Amazon SURE program with Amazon and Georgia tech. Developed sensor monitor supporting team of 4 engineers. Gained exposure to working with ROS2 and embedded system controls working with Husky UAV. Project prevented 1x week of downtime for engineers contributing to 20% more data being collected ",
  },
];

function ExperienceTimeline() {
  const [expanded, setExpanded] = useState<null | number>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto relative">
      {/* Timeline line */}
      <div className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400/80 to-yellow-900/30 rounded-full -translate-x-1/2 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`} style={{ zIndex: 0, transformOrigin: 'center top' }} />
      
      <ul className="relative z-10">
        {experienceEntries.map((exp, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <li key={idx} className="mb-16 flex items-center relative min-h-[120px]">
              {/* Timeline dot */}
              <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 transition-all duration-500 delay-${400 + idx * 100} ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}>
                <span className="w-6 h-6 rounded-full border-4 border-black shadow-lg" style={{ backgroundColor: exp.color === 'red' ? '#ef4444' : exp.color === 'blue' ? '#3b82f6' : exp.color === 'orange' ? '#f97316' : '#eab308' }} />
              </div>
              
                            {/* Experience card - left or right of timeline */}
              <div className={`w-1/2 ${isLeft ? 'pr-8' : 'pl-8'} ${isLeft ? 'text-right' : 'text-left'}`}>
                <div className={`bg-black/80 border-2 rounded-xl p-4 shadow-lg hover:scale-105 transition-all duration-300 ${isLeft ? 'ml-auto' : 'mr-auto'} ${
                  isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isLeft ? '-translate-x-8' : 'translate-x-8'}`
                }`} style={{ 
                  maxWidth: 280, 
                  transitionDelay: `${500 + idx * 150}ms`,
                  borderColor: exp.color === 'red' ? '#ef4444' : exp.color === 'blue' ? '#3b82f6' : exp.color === 'orange' ? '#f97316' : '#eab308'
                }}>
                  {/* Company logo and name */}
                  <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img
                      src={exp.logo || "https://img.icons8.com/ios-filled/50/FFD600/company.png"}
                      alt={exp.company + ' logo'}
                      className="w-10 h-10 object-contain rounded-full border-2 bg-white shadow flex-shrink-0"
                      style={{ borderColor: exp.color === 'red' ? '#ef4444' : exp.color === 'blue' ? '#3b82f6' : exp.color === 'orange' ? '#f97316' : '#eab308' }}
                      draggable={false}
                    />
                    <div className={`flex flex-col ${isLeft ? 'items-end' : 'items-start'}`}>
                      <span className="text-lg font-bold" style={{ color: exp.color === 'red' ? '#fca5a5' : exp.color === 'blue' ? '#93c5fd' : exp.color === 'orange' ? '#fed7aa' : '#fde047' }}>{exp.company}</span>
                      <span className="text-sm text-gray-400 font-mono">{exp.date}</span>
                    </div>
                  </div>
                  
                  {/* Expand button */}
                  <button
                    className={`w-full border rounded-lg py-2 px-3 transition-all duration-200 text-sm font-medium ${isLeft ? 'text-right' : 'text-left'}`}
                    style={{ 
                      backgroundColor: exp.color === 'red' ? '#7f1d1d' : exp.color === 'blue' ? '#1e3a8a' : exp.color === 'orange' ? '#7c2d12' : '#713f12',
                      borderColor: exp.color === 'red' ? '#ef4444' : exp.color === 'blue' ? '#3b82f6' : exp.color === 'orange' ? '#f97316' : '#eab308',
                      color: exp.color === 'red' ? '#fca5a5' : exp.color === 'blue' ? '#93c5fd' : exp.color === 'orange' ? '#fed7aa' : '#fde047'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = exp.color === 'red' ? '#991b1b' : exp.color === 'blue' ? '#1e40af' : exp.color === 'orange' ? '#9a3412' : '#92400e';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = exp.color === 'red' ? '#7f1d1d' : exp.color === 'blue' ? '#1e3a8a' : exp.color === 'orange' ? '#7c2d12' : '#713f12';
                    }}
                    onClick={() => setExpanded(idx)}
                    tabIndex={0}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
              
              {/* Empty space for the other side */}
              <div className="w-1/2" />
            </li>
          );
        })}
      </ul>
      
      {/* Modal for expanded experience */}
      {expanded !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setExpanded(null)}
        >
          <div
            className="relative bg-black border rounded-2xl shadow-2xl p-8 max-w-lg w-[90vw] animate-zoom-in"
            style={{ borderColor: experienceEntries[expanded].color === 'red' ? '#ef4444' : experienceEntries[expanded].color === 'blue' ? '#3b82f6' : experienceEntries[expanded].color === 'orange' ? '#f97316' : '#eab308' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl font-bold"
              style={{ color: experienceEntries[expanded].color === 'red' ? '#fca5a5' : experienceEntries[expanded].color === 'blue' ? '#93c5fd' : experienceEntries[expanded].color === 'orange' ? '#fed7aa' : '#fde047' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = experienceEntries[expanded].color === 'red' ? '#f87171' : experienceEntries[expanded].color === 'blue' ? '#60a5fa' : experienceEntries[expanded].color === 'orange' ? '#fb923c' : '#facc15';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = experienceEntries[expanded].color === 'red' ? '#fca5a5' : experienceEntries[expanded].color === 'blue' ? '#93c5fd' : experienceEntries[expanded].color === 'orange' ? '#fed7aa' : '#fde047';
              }}
              onClick={() => setExpanded(null)}
              aria-label="Close"
            >
              &times;
            </button>
            
            {/* Header with logo and company info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={experienceEntries[expanded].logo || "https://img.icons8.com/ios-filled/50/FFD600/company.png"}
                alt={experienceEntries[expanded].company + ' logo'}
                className="w-12 h-12 object-contain rounded-full border-2 bg-white shadow"
                style={{ borderColor: experienceEntries[expanded].color === 'red' ? '#ef4444' : experienceEntries[expanded].color === 'blue' ? '#3b82f6' : experienceEntries[expanded].color === 'orange' ? '#f97316' : '#eab308' }}
                draggable={false}
              />
              <div>
                <span className="text-xl font-bold" style={{ color: experienceEntries[expanded].color === 'red' ? '#fca5a5' : experienceEntries[expanded].color === 'blue' ? '#93c5fd' : experienceEntries[expanded].color === 'orange' ? '#fed7aa' : '#fde047' }}>{experienceEntries[expanded].title}</span>
                <div className="text-base text-gray-300">@ {experienceEntries[expanded].company}</div>
                <div className="text-sm text-gray-400 font-mono">{experienceEntries[expanded].date}</div>
              </div>
            </div>
            
            <p className="text-gray-300 text-base whitespace-pre-line">{experienceEntries[expanded].description}</p>
          </div>
          <style>{`
            @keyframes zoom-in {
              0% { opacity: 0; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-zoom-in {
              animation: zoom-in 0.25s cubic-bezier(0.7,0,0.3,1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative w-full bg-black text-white scroll-smooth">
      {/* Sticky Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-center gap-4 py-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-gray-300 hover:text-cyan-400 px-3 py-1 rounded transition-colors duration-200 text-base font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <main className="pt-16">
        {/* Hero Section */}
        <Section id="hero">
          <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-8">
            <div className="flex-1 flex flex-col items-center sm:items-start justify-center z-10 py-12">
              <h1
                className="text-5xl sm:text-7xl font-extrabold tracking-wide text-white select-none mb-8 animate-slide-up-fade"
                style={{ fontFamily: 'Quicksand, Inter, Arial, sans-serif' }}
              >
                Rodrigo Garcia
              </h1>
              <p className="text-lg sm:text-2xl text-gray-300 text-center sm:text-left max-w-xl font-[600] rounded-xl animate-slide-up-fade-delayed mb-8" style={{ fontFamily: 'Quicksand, Arial, sans-serif' }}>
                Senior Computer Science Student
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-6 animate-slide-up-fade-delayed">
                <a
                  href="https://github.com/rgarcia2304"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-black/50 border-2 border-cyan-400/30 rounded-full hover:border-cyan-400 hover:scale-110 transition-all duration-300"
                  aria-label="GitHub Profile"
                >
                  <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                
                <a
                  href="rgarcia22141@gmail.com"
                  className="group p-3 bg-black/50 border-2 border-green-400/30 rounded-full hover:border-green-400 hover:scale-110 transition-all duration-300"
                  aria-label="Email"
                >
                  <svg className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                  </svg>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/rodrigo-garcia-penn200423/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-black/50 border-2 border-purple-400/30 rounded-full hover:border-purple-400 hover:scale-110 transition-all duration-300"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative w-full h-[340px] sm:h-[440px] animate-fade-in-delayed">
              <TetrisAnimation />
            </div>
          </div>
        </Section>
        <Section id="about" title="About Me">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main About Card */}
            <div className="bg-black/60 border-2 border-cyan-400/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Main description */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-cyan-300">Who I Am</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Hello! I'm <span className="text-cyan-400 font-semibold">Rodrigo</span>, a senior computer science student 
                    who loves to explore different challenges in programming and beyond.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Currently in my free time, I'm diving deep into <span className="text-cyan-400 font-semibold">GoLang</span> and 
                    exploring <span className="text-cyan-400 font-semibold">systems-level work</span> to expand my technical horizons.
                  </p>
                </div>
                
                {/* Right side - Key highlights */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-400/10 border border-green-400/20 rounded-xl">
                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium">Passionate about Systems Programming</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-400/10 border border-purple-400/20 rounded-xl">
                    <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium">Always Learning New Technologies</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-red-400/10 border border-red-400/20 rounded-xl">
                    <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium">Problem Solver & Innovator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Beyond Programming - Animated Stick Figure */}
            <div className="bg-black/60 border-2 border-yellow-400/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-yellow-300">Beyond Programming</h3>
              </div>
              
              <div className="flex flex-col items-center">
                {/* Rotating Images */}
                <div className="relative w-32 h-32 mb-6">
                  {/* Soccer Image */}
                  <div className="absolute inset-0 animate-soccer-scene flex items-center justify-center">
                    <div className="w-24 h-24 bg-green-400/20 rounded-full flex items-center justify-center border-2 border-green-400/30">
                      <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Reading Image */}
                  <div className="absolute inset-0 animate-reading-scene flex items-center justify-center">
                    <div className="w-24 h-24 bg-purple-400/20 rounded-full flex items-center justify-center border-2 border-purple-400/30">
                      <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 19V6h8v13H3zm18 0h-8V6h8v13zm-7-9.5h6V11h-6V9.5zm0 2.5h6v1.5h-6V12zm0 2.5h6V16h-6v-1.5z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Fishing Image */}
                  <div className="absolute inset-0 animate-fishing-scene flex items-center justify-center">
                    <div className="w-24 h-24 bg-red-400/20 rounded-full flex items-center justify-center border-2 border-red-400/30">
                      <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg text-center leading-relaxed max-w-2xl">
                  Other than programming, I enjoy being outside, reading game theory and philosophy, and hope to learn new languages!
                </p>
              </div>
            </div>
          </div>
        </Section>
        
        <Section id="education" title="Education">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/60 border-2 border-green-400/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left side - Degree Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09v6L12 21l-7-3.82v-6L12 3z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-300">Degree</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4">
                      <h4 className="text-xl font-bold text-green-300 mb-2">B.S. in Computer Science</h4>
                      <p className="text-gray-300 font-medium">Pennsylvania State University</p>
                      <p className="text-gray-400 text-sm">Expected Graduation: May 2026</p>
                    </div>
                    
                    <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4">
                      <h4 className="text-lg font-bold text-green-300 mb-2">Awards</h4>
                      <p className="text-gray-300">Lenfest Scholar, Deans List</p>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Coursework */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-300">Relevant Coursework</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Data Structures</span>
                    </div>
                    <div className="bg-black/40 border border-yellow-400/20 rounded-lg p-3 hover:border-yellow-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Algorithms</span>
                    </div>
                    <div className="bg-black/40 border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Software Engineering</span>
                    </div>
                    <div className="bg-black/40 border border-purple-400/20 rounded-lg p-3 hover:border-purple-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Web Development</span>
                    </div>
                    <div className="bg-black/40 border border-red-400/20 rounded-lg p-3 hover:border-red-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">AI and Ethics</span>
                    </div>
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Systems Programming</span>
                    </div>
                    <div className="bg-black/40 border border-yellow-400/20 rounded-lg p-3 hover:border-yellow-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Operating Systems</span>
                    </div>
                    <div className="bg-black/40 border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-200">
                      <span className="text-gray-300 text-sm font-medium">Linear Programming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section id="projects" title="Projects">
          <TabbedProjects />
        </Section>
        <Section id="experience" title="Experience">
          <ExperienceTimeline />
        </Section>
        <Section id="skills" title="Skills">
          <div className="max-w-6xl mx-auto">
            <div className="bg-black/60 border-2 border-purple-400/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Programming Languages */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-cyan-300">Languages</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center">
                        <span className="text-black text-xs font-bold">JS</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">JavaScript</span>
                    </div>
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">TS</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">TypeScript</span>
                    </div>
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                        <span className="text-yellow-300 text-xs font-bold">Py</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Python</span>
                    </div>
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">J</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Java</span>
                    </div>
                    
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">C</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">C</span>
                    </div>
                    <div className="bg-black/40 border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-cyan-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Go</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Go</span>
                    </div>
                    
                  </div>
                </div>

                {/* Frameworks & Libraries */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-300">Frameworks</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-cyan-400 rounded-sm flex items-center justify-center">
                        <span className="text-black text-xs font-bold">R</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">React</span>
                    </div>
                    <div className="bg-black/40 border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">N</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Next.js</span>
                    </div>
                    <div className="bg-black/40 border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">N</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Node.js</span>
                    </div>
                    
                    <div className="bg-black/40 border border-green-400/20 rounded-lg p-3 hover:border-green-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Spring</span>
                    </div>
                   
                   
                    
                  </div>
                </div>

                {/* Tools & Technologies */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-red-300">Tools & Tech</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 border border-red-400/20 rounded-lg p-3 hover:border-red-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-orange-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Git</span>
                    </div>
                   
                    <div className="bg-black/40 border border-red-400/20 rounded-lg p-3 hover:border-red-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-500 rounded-sm flex items-center justify-center">
                        <span className="text-black text-xs font-bold">L</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Linux</span>
                    </div>
                    <div className="bg-black/40 border border-red-400/20 rounded-lg p-3 hover:border-red-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">MongoDB</span>
                    </div>
                    <div className="bg-black/40 border border-red-400/20 rounded-lg p-3 hover:border-red-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">SQL</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">MySQL</span>
                    </div>
                    
                    <div className="bg-black/40 border border-red-400/20 rounded-lg p-3 hover:border-red-400/40 transition-all duration-200 flex items-center gap-2">
                      <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">Firebase</span>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section id="contact" title="Contact">
          <div className="max-w-2xl text-gray-300 text-lg text-center">
            {/* Add your contact info or a contact form here */}
            <p>Email: rgarcia22141@gmail.com</p>
            <p>LinkedIn:https://www.linkedin.com/in/rodrigo-garcia-penn200423/</p>
          </div>
        </Section>
      </main>
      <style>{`
        html { scroll-behavior: smooth; }
        
        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up-fade-delayed {
          0% { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-slide-up-fade {
          animation: slide-up-fade 1.2s 0.7s forwards cubic-bezier(0.7,0,0.3,1);
        }
        
        .animate-slide-up-fade-delayed {
          animation: slide-up-fade 1.2s 1.2s forwards cubic-bezier(0.7,0,0.3,1);
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.5s 1.5s forwards cubic-bezier(0.7,0,0.3,1);
        }
        
        /* Smooth scrolling for better animation experience */
        * {
          scroll-behavior: smooth;
        }
        
        /* Rotating Image Animations */
        @keyframes soccer-scene {
          0%, 33% { opacity: 1; transform: scale(1); }
          34%, 100% { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes reading-scene {
          0%, 33% { opacity: 0; transform: scale(0.8); }
          34%, 66% { opacity: 1; transform: scale(1); }
          67%, 100% { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes fishing-scene {
          0%, 66% { opacity: 0; transform: scale(0.8); }
          67%, 100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-soccer-scene {
          animation: soccer-scene 6s infinite ease-in-out;
        }
        
        .animate-reading-scene {
          animation: reading-scene 6s infinite ease-in-out;
        }
        
        .animate-fishing-scene {
          animation: fishing-scene 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
