'use client';
import React, { useEffect, useState, useRef } from "react";
import Image from 'next/image';







const Section = ({ id, title, children }: { id: string; title?: string; children: React.ReactNode }) => {
  return (
    <section 
      id={id} 
      className="min-h-screen flex flex-col justify-center items-center w-full px-4 sm:px-6 py-16 sm:py-20 scroll-mt-24"
    >
      {title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-12 text-gray-900 text-center tracking-tight px-4">
          {title}
        </h2>
      )}
      <div className="w-full flex flex-col items-center">
    {children}
      </div>
  </section>
);
};

const navLinks = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "involvement", label: "Involvement" },
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
        type: "class",
      },
      {
        title: "Linear Device",
        date: "February 2024 - May 2024",
        description:
          "Developed a custom networked MDADM system in C on Linux to remotely manage JBOD (Just a Bunch of Disks) devices over TCP using a self-designed client-server protocol. Implemented core operations such as mount, read, write, and unmount, with support for 1MB linear addressing and robust byte-level packet assembly and error-checking. Built a caching layer with an LRU replacement policy to optimize read/write latency and maximize cache hit rates. Ensured reliable data transmission by designing multi-call read/write logic to handle partial packets and maintain consistency across networked storage operations.",
        technologies: ["C", "Linux", "Networking", "LRU Cache"],
        type: "class",
      },
      {
        title: "Mini Shell",
        date: "March 2025 - April 2025",
        description:
          "Emulated core UNIX shell behavior by developing a custom Bash-like environment supporting process creation, directory navigation, piping, I/O redirection, and conditional, sequential, and parallel command execution.",
        technologies: ["C", "Linux", "CLI", "Systems Programming"],
        type: "class",
      },
      {
        title: "C Sender/Receiver Channel",
        date: "April 2024 - May 2024",
        description:
          "Implemented a sender/receiver channel in C supporting both non-blocking and blocking send/receive operations. Designed the channel for concurrent producer/consumer scenarios, using POSIX threads and synchronization primitives to ensure safe, efficient message passing. Explored edge cases for deadlock, starvation, and race conditions.",
        technologies: ["C", "POSIX Threads", "Concurrency", "Non-blocking IO", "Blocking IO"],
        type: "class",
      },
      {
        title: "5 Stage Pipeline Processor",
        date: "October 2024 - December 2024",
        description:
          "Designed and implemented a fully functional 5-stage pipelined CPU using Verilog, encompassing instruction fetch, decode, execute, memory access, and write-back stages. Built the processor from the ground up, optimizing performance by implementing hazard detection and handling mechanisms for both data and structural hazards. This project demonstrates a strong grasp of computer architecture, low-level digital design, and efficient pipeline control logic.",
        technologies: ["Verilog", "CPU Design", "Computer Architecture"],
        type: "class",
      },
    ],
  },
  {
    category: "Web & Blockchain",
    projects: [
      {
        title: "Pokemon Deck Game Simulator",
        date: "November 2025 - December 2025",
        description:
          "PokéDeck is a systems focused Go CLI application that recreates a Pokémon game experience through a custom interactive REPL. The project emphasizes clean architecture and performance, featuring a thread safe LRU cache with a background cleanup goroutine to efficiently manage external Pokémon API requests. It includes persistent local storage for user decks, a fully modular turn-based battle engine with AI-controlled opponents, move selection, and type based damage calculations. Core game logic is intentionally decoupled from terminal rendering to ensure testability, maintainability, and extensibility, showcasing practical use of concurrency, state management, and domain modeling in Go.",
        technologies: ["Go"],
        github: "https://github.com/rgarcia2304/pokedexcli",
        type: "personal",
      },
      {
        title: "Group-Payment App",
        date: "April 2025 - Present",
        description:
          "Designed and developed a full-stack blockchain-based group payment app to solve the social pressure of deciding who pays the tab. Built with Solidity smart contracts to enable group formation, voting on a designated payer, and conditional fund disbursement only when a target contribution is reached. Integrated MetaMask for wallet authentication and transaction signing, ensuring secure, user-controlled payments. All transactions and voting records are immutably stored on the blockchain for transparency. The app is deployed using Next.js with a React frontend and a Web3-enabled backend, providing a seamless decentralized experience for collaborative group payments.",
        technologies: ["Solidity", "MetaMask", "Web3", "Next.js", "React", "Blockchain"],
        github: "https://github.com/rgarcia2304/block-pay",
        type: "personal",
      },
      {
        title: "Eterna | Reddit Filtering App",
        date: "February 2025 - March 2025",
        description:
          "Built a full-stack product recommendation app that filters Reddit discussions to surface high-quality suggestions based on community feedback. Users enter a product-related query, which is processed through the Reddit Scraper API (via RapidAPI) to gather relevant posts. The results are then passed to the OpenAI GPT API using prompt-based filtering to eliminate non-product discussions and rank responses by helpfulness. Non-product or vague queries are also automatically filtered. Deployed with Firebase for real-time database storage and built using React, Next.js, and styled-components for a modern, responsive UI.",
        technologies: ["React", "Next.js", "OpenAI", "Firebase", "RapidAPI", "Styled-components"],
        type: "personal",
        github: "https://github.com/rgarcia2304/class-app"
      },
      {
        title: "Flight Application",
        date: "August 2024 - November 2024",
        description:
          "Independently designed and built a fully custom, microservice-based flight application from the ground up—no external APIs or tools used. Developed the Flight Creation microservice in Java using the Spring Framework, engineered the Booking system in C# with ASP.NET and MongoDB, and implemented the Payment microservice using GraphQL with Spring and MySQL. Constructed the entire backend architecture and frontend interface using React, managing all data flow, service communication, and storage logic manually to ensure full control and understanding of the system. This project showcases complete ownership over microservice design, API creation, and full-stack integration.",
        technologies: ["Java", "Spring", "C#", "ASP.NET", "MongoDB", "GraphQL", "MySQL", "React"],
        type: "personal",
        github: "https://github.com/rgarcia2304/FLIGHT-APP"
      },
      {
        title: "Course Scheduler",
        date: "October 2023 - December 2023",
        description:
          "Developed a Java-based course scheduler application using a layered architecture, separating concerns across user interface, business logic, and data access layers. Built an interactive GUI for scheduling classes, leveraging Object-Oriented Programming to map each course to its corresponding database table. Enhanced functionality by implementing SQL queries for efficient data retrieval and manipulation, enabling dynamic updates and interaction between the GUI and the backend database.",
        technologies: ["Java", "SQL", "OOP", "GUI"],
        type: "class",
      },
      {
        title: "AI Agent",
        date: "August 2025- September 2025",
        description:
          "Created an AI agent that utilizied an LLM to perform tasks on a codebase autonomolsy, with prompting. The Agent could read file directories, file contents, write files, and also run files.  ",
        technologies: ["Python","Gemini"],
        github: "https://github.com/rgarcia2304/AI-Agent",
        type: "personal",
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
        type: "class",
      },
      {
        title: "Poultry Health Monitor",
        date: "August 2025 - December 2025",
        description:
          "Worked in collaboration with a Nigerian Start Up funded by the United Nations to come up with a solution to detecting bird influenza. Architected the software process which connected and processed decisions in the poultry health monitor. Spent majority of project working on the weight and camera subsystem. For weight subsystem programmed a strain gauge weight system which used weights of chickens to flag for signs of illness, when reading weights. Created a chicken detection system using usb cameras that worked using transfer learning techniques.  ",
        technologies: ["Embedded Systems", "PyTorch", "RPi4"],
        type: "class",
      },

    ],
  },
  {
    category: "Other Fun Stuff",
    projects: [
      {
        title: "Autonomous Vacuum Cleaner",
        date: "February 2025 - March 2025",
        description:
          "Developed an autonomous vacuum cleaning simulation using the ACT-R cognitive architecture in Python to model intelligent Roomba-like behavior. Implemented motor and visual module rules to execute swirling cleaning patterns and respond dynamically to collisions with debris or walls. Leveraged ACT-R's visual processing to guide real-time decision-making and adaptive navigation in cluttered environments, simulating human-like perception and action in robotic cleaning tasks. Leveraged HDM to create intelligent recall of debris simulating real human memory accelerating map cleaning speed.",
        technologies: ["Python", "ACT-R", "HDM", "Simulation"],
        type: "class",
      },
        {
          title: "Static Site Generator",
          date: "February 2025 - March 2025",
          description:
            "Made this static site generator which parses markdown files and turns it into HTML. This was built by using builing markdown text parsing which first converts lines of markdown into text nodes, then to html nodes. Blocks are also parsed. To represent the hiearchy of the markdown to html recursive node tree structure was used to represent relationships between HTML nodes. The site generator also performs clean up for builds, crawls content files, and performs template injection. ",
          technologies: ["Python"],
          github: "https://github.com/rgarcia2304/static_site",
          type: "personal",
        },
    ],
  },
];

function TabbedProjects() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expanded, setExpanded] = useState<null | { group: number; idx: number }>(null);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="w-full mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex flex-row gap-2 sm:gap-4 justify-start sm:justify-center min-w-max sm:min-w-0 px-4 sm:px-0 pb-2">
          {groupedProjects.map((group, idx) => (
            <button
              key={group.category}
              className={`flex items-center justify-center border-2 ${selectedTab === idx ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-900 bg-white text-gray-900'} rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 min-w-fit sm:min-w-[140px] shadow-lg transition-colors outline-none flex-shrink-0`}
              onClick={() => setSelectedTab(idx)}
              tabIndex={0}
            >
              <span className="text-xs sm:text-sm md:text-base font-black text-center whitespace-nowrap">{group.category}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Projects grid for selected tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-4 sm:px-0">
        {groupedProjects[selectedTab].projects.map((project, idx) => (
          <button
            key={project.title}
            className="bg-white border-2 border-gray-900 rounded-xl p-4 sm:p-6 shadow-lg flex flex-col text-left outline-none cursor-pointer relative hover:shadow-xl transition-shadow"
            style={{ zIndex: expanded && expanded.group === selectedTab && expanded.idx === idx ? 50 : 1 }}
            onClick={() => setExpanded({ group: selectedTab, idx })}
            tabIndex={0}
          >
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-black text-gray-900 truncate">{project.title}</span>
                {project.type && (
                  <span className={`px-2 py-0.5 rounded text-xs font-black ${
                    project.type === 'class' 
                      ? 'bg-blue-100 text-blue-900 border-2 border-blue-900' 
                      : 'bg-purple-100 text-purple-900 border-2 border-purple-900'
                  }`}>
                    {project.type === 'class' ? 'Class' : 'Personal'}
                  </span>
                )}
            </div>
              <span className="text-xs text-gray-600">{project.date}</span>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>
            {/* GitHub icon link in card if present */}
            {'github' in project && project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                onClick={e => e.stopPropagation()}
                tabIndex={0}
                aria-label="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
    
          </button>
        ))}
      </div>
      {/* Modal overlay for expanded project */}
      {expanded !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setExpanded(null)}
        >
          <div
            className="relative bg-white border-2 border-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-[90vw]"
            style={{ minHeight: 320 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-900 hover:text-gray-700 text-2xl font-black"
              onClick={() => setExpanded(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-black text-gray-900">{groupedProjects[expanded.group].projects[expanded.idx].title}</span>
                {groupedProjects[expanded.group].projects[expanded.idx].type && (
                  <span className={`px-3 py-1 rounded text-sm font-black ${
                    groupedProjects[expanded.group].projects[expanded.idx].type === 'class' 
                      ? 'bg-blue-100 text-blue-900 border-2 border-blue-900' 
                      : 'bg-purple-100 text-purple-900 border-2 border-purple-900'
                  }`}>
                    {groupedProjects[expanded.group].projects[expanded.idx].type === 'class' ? 'Class' : 'Personal'}
                  </span>
                )}
            </div>
              <span className="text-xs text-gray-600">{groupedProjects[expanded.group].projects[expanded.idx].date}</span>
            </div>
            <p className="text-gray-700 text-base mb-4 whitespace-pre-line">{groupedProjects[expanded.group].projects[expanded.idx].description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {groupedProjects[expanded.group].projects[expanded.idx].technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
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
      "Worked in AGILE team of over 15 engineers. Wrote RESTFUL APIs that combined data from Approvals and Checkout orders. Developed dashboard allowing engineers to directly modify orders  client conflict resolution.",
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
      "One of seven students selected to go work in Metz, France in the Amazon SURE program with Amazon and Georgia Tech. Developed sensor monitor supporting team of 4 engineers. Gained exposure to working with ROS2 and embedded system controls working with Husky UAV. Project immediatley diagnosed system failures saving, allowing for 20% more experimentation per week",
  },
];

function ExperienceTimeline() {
  const [expanded, setExpanded] = useState<null | number>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="space-y-6 sm:space-y-8">
        {experienceEntries.map((exp, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-900 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-start gap-3 sm:gap-4">
                    <Image
                      src={exp.logo || "https://img.icons8.com/ios-filled/50/FFD600/company.png"}
                      alt={exp.company + ' logo'}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border-2 border-gray-900 flex-shrink-0"
                draggable={false}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">{exp.title}</h3>
                  <span className="text-xs sm:text-sm text-gray-600 font-mono">{exp.date}</span>
              </div>
                <p className="text-base sm:text-lg font-bold text-gray-700 mb-2 sm:mb-3">@ {exp.company}</p>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{exp.description}</p>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}

function useScrollSpy(ids: string[], offset = 80) {
  const [activeId, setActiveId] = useState(ids[0]);
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
      let found = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top - offset < 0) {
            found = id;
          }
        }
      }
          setActiveId(prev => prev !== found ? found : prev);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids, offset]);
  return activeId;
}

// Involvement data
const involvementEntries = [
  {
    org: "Society of Hispanic Professional Engineers",
    role: "Member, Networking Director",
    date: "2023 - Present",
    logo: "https://img.icons8.com/ios-filled/100/FFD600/source-code.png",
    description: "",
    link: "https://acm.psu.edu/"
  },
  
];

export default function Home() {
  const activeSection = useScrollSpy(navLinks.map(l => l.id), 100);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full bg-stone-50 text-gray-900 scroll-smooth">
      {/* Clean Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b-2 border-gray-900 shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row items-center justify-center gap-2 py-3">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                  className={`relative px-4 py-2 rounded-full font-black text-sm transition-all duration-200 outline-none
                    ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:text-gray-900'}
                `}
                tabIndex={0}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between py-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <span className="font-black text-lg">RG</span>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t-2 border-gray-900 bg-white">
              <div className="flex flex-col py-2">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className={`px-4 py-3 font-black text-base transition-colors
                        ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                      tabIndex={0}
                    >
                      {link.label}
              </a>
            );
          })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sections */}
      <main className="pt-20 md:pt-16">
        {/* Hero Section */}
        <Section id="hero">
          <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-12 max-w-6xl mx-auto px-4">
            {/* Text Content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 w-full">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-4">
                Rodrigo Garcia
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-8 md:mb-12">
                Senior Computer Science Student
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href="https://github.com/rgarcia2304"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                
                <a
                  href="mailto:rgarcia22141@gmail.com"
                  className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="Email"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                  </svg>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/rodrigo-garcia-penn200423/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex-1 flex items-center justify-center w-full max-w-sm md:max-w-md">
              <div className="w-full aspect-square border-4 border-gray-900 rounded-2xl shadow-lg overflow-hidden">
                <Image
                  src="/images/pfp.jpeg"
                  alt="Rodrigo Garcia"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Section>
        <Section id="about" title="About Me">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 px-4">
            {/* Main About Card */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6">Who I Am</h3>
              <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                <p>
                  Hello! I&apos;m <span className="font-black text-gray-900">Rodrigo</span>, a senior computer science student. 
                  My passion lies in logic and I am aspiring to be a software engineer!
                  </p>
                <p>
                  Currently I am learning how to build backend systems in <span className="font-black text-gray-900">GoLang</span>.
                </p>
                <div className="mt-6 pt-6 border-t-2 border-gray-900">
                  <p className="text-base">
                    If you want to check out some non tech stuff, I built a <a href="https://rgarcia2304.github.io/static_site/" className="font-black text-gray-900 underline hover:no-underline">static site generator from scratch</a> that hosts some of my personal essays and other writing!
                  </p>
                </div>
              </div>
            </div>

            {/* Beyond Programming */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6">A little more about me ...</h3>
              <div className="space-y-4">
                <div className="border-2 border-gray-900 rounded-xl p-4">
                  <p className="text-base sm:text-lg text-gray-700">
                    I enjoy being active through playing soccer and weightlifting, but enjoy all sports. I am a lifetime <span className='font-black text-gray-900'>Manchester United</span> fan.
                  </p>
                </div>
                <div className="border-2 border-gray-900 rounded-xl p-4">
                  <p className="text-lg text-gray-700">
                    I enjoy reading, and while primarily interested in nonfiction, I have begun to read some of the classic novels. My favorite books include <span className='font-black text-gray-900'>Pillars of The Earth</span> and <span className='font-black text-gray-900'>Crime and Punishment</span>.
                  </p>
              </div>
                <div className="border-2 border-gray-900 rounded-xl p-4">
                  <p className="text-lg text-gray-700">
                    <span className='font-black text-gray-900'>Huge Ben Franklin fan</span>!
                  </p>
                  </div>
              </div>
            </div>
          </div>
        </Section>
        
        <Section id="education" title="Education">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* Left side - Degree Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Degree</h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-gray-900 rounded-xl p-4">
                      <h4 className="text-xl font-black text-gray-900 mb-2">B.S. in Computer Science</h4>
                      <p className="text-gray-700 font-bold">Pennsylvania State University</p>
                      <p className="text-gray-600 text-sm">Expected Graduation: May 2026</p>
                    </div>
                    
                    <div className="border-2 border-gray-900 rounded-xl p-4">
                      <h4 className="text-lg font-black text-gray-900 mb-2">Awards</h4>
                      <p className="text-gray-700">Lenfest Scholar, Deans List, College of Agriculture Best Agriculture Project Award</p>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Coursework */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Relevant Coursework</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">Data Structures and Algorithms</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">Web Development</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">AI and Ethics</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">Systems Programming</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">Operating Systems</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">Linear Programming</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-bold">Computer Networks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Section id="involvement" title="Involvement">
          <div className="max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 px-4">
            {involvementEntries.map((inv, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white border-2 border-gray-900 p-4 sm:p-6 rounded-xl shadow-lg">
                {/* Left: Logo, Org, Role, Date */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-4 w-full sm:w-auto sm:min-w-[180px]">
                  <div className="flex-1 sm:flex-none">
                    <div className="text-base font-black text-gray-900">{inv.org}</div>
                    <div className="text-sm text-gray-700 font-bold">{inv.role}</div>
                    <div className="text-xs text-gray-600">{inv.date}</div>
                  </div>
                </div>
                {/* Right: Description */}
                <div className="flex-1 text-gray-700 text-sm sm:text-base leading-relaxed">
                  {inv.description || <span>Managed social media accounts and communications <span className='font-black text-gray-900'>with hundreds </span> of alumni. 
                    <span className='font-black text-gray-900'> Ran and doubled</span> the mentorship program and expanded it to include alumni.
                    <span className='font-black text-gray-900'> Created multi-thousand dollar </span>  opportunites that allowed members to attend the National Conference free of charge!
                    </span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section id="projects" title="Projects">
          <TabbedProjects />
        </Section>
        <Section id="experience" title="Experience">
          <ExperienceTimeline />
        </Section>
        <Section id="skills" title="Skills">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Programming Languages */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Languages</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">JavaScript</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">TypeScript</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Python</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Java</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">C</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Go</span>
                    </div>
                  </div>
                </div>

                {/* Frameworks & Libraries */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Frameworks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">React</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Next.js</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Node.js</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Spring</span>
                    </div>
                  </div>
                </div>

                {/* Tools & Technologies */}
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-900 mb-4">Tools & Tech</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Git</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Linux</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">MongoDB</span>
                      </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">MySQL</span>
                    </div>
                    <div className="border-2 border-gray-900 rounded-lg p-3">
                      <span className="text-gray-900 text-sm font-black">Firebase</span>
                      </div>
                    </div>
                      </div>
                    </div>
            </div>
          </div>
        </Section>
        <Section id="contact" title="Contact">
          <div className="max-w-2xl mx-auto px-4 text-gray-900 text-base sm:text-lg text-center">
            <p className="font-bold mb-4">Email: <a href="mailto:rgarcia22141@gmail.com" className="font-black underline break-all">rgarcia22141@gmail.com</a></p>
            <p className="font-bold">LinkedIn: <a href="https://www.linkedin.com/in/rodrigo-garcia-penn200423/" target="_blank" rel="noopener noreferrer" className="font-black underline break-all">rodrigo-garcia-penn200423</a></p>
            <p className="font-bold">Resume: <a href="https://drive.google.com/file/d/1WT7V6E8E9lbCtBzMyYrcneCj8wY48k07/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="font-black underline break-all">locatedHere</a></p>

          </div>
        </Section>
      </main>
      <style>{`
        html { scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}