const roadmaps = {
    "JavaScript": [
        { step: 1, title: "JavaScript Basics", description: "Understand how JS works in the browser and Node.js." },
        { step: 2, title: "Variables and Data Types", description: "Learn let, const, var, strings, numbers, booleans, null, undefined." },
        { step: 3, title: "Operators", description: "Arithmetic, assignment, comparison, and logical operators." },
        { step: 4, title: "Conditional Statements", description: "if, else if, else, and switch statements." },
        { step: 5, title: "Loops", description: "for, while, do...while, for...in, for...of." },
        { step: 6, title: "Functions", description: "Function declarations, expressions, arrow functions, and scope." },
        { step: 7, title: "Arrays", description: "Array methods like map, filter, reduce, push, pop." },
        { step: 8, title: "Objects", description: "Object literals, methods, destructuring, and the 'this' keyword." },
        { step: 9, title: "DOM Manipulation", description: "Selecting elements, changing styles, and handling events." },
        { step: 10, title: "ES6+ Features", description: "Template literals, spread/rest operators, modules." },
        { step: 11, title: "Promises", description: "Understanding asynchronous code and Promise chaining." },
        { step: 12, title: "Async/Await", description: "Modern way to handle asynchronous operations." },
        { step: 13, title: "Build Projects", description: "Create small projects like a to-do list or weather app." }
    ],
    "React": [
        { step: 1, title: "React Fundamentals", description: "Understand JSX, components, and the virtual DOM." },
        { step: 2, title: "Props and State", description: "Passing data with props and managing local state with useState." },
        { step: 3, title: "Handling Events", description: "React event handlers and forms." },
        { step: 4, title: "Hooks", description: "useEffect, useRef, useMemo, and custom hooks." },
        { step: 5, title: "Routing", description: "Using React Router DOM for single-page applications." },
        { step: 6, title: "Context API", description: "Managing global state without prop drilling." },
        { step: 7, title: "API Integration", description: "Fetching data using fetch or axios." },
        { step: 8, title: "Build Projects", description: "Build complex interactive UIs." }
    ],
    "Node.js": [
        { step: 1, title: "Node.js Basics", description: "Event loop, global objects, and modules." },
        { step: 2, title: "File System (fs)", description: "Reading and writing files asynchronously." },
        { step: 3, title: "NPM", description: "Managing packages and scripts." },
        { step: 4, title: "Express.js Basics", description: "Setting up a simple web server with Express." },
        { step: 5, title: "Routing & Middleware", description: "Handling HTTP requests and creating custom middleware." },
        { step: 6, title: "REST APIs", description: "Designing and building RESTful endpoints." },
        { step: 7, title: "Error Handling", description: "Centralized error handling in Node apps." }
    ],
    "MongoDB": [
        { step: 1, title: "NoSQL Concepts", description: "Understanding document-based databases." },
        { step: 2, title: "MongoDB Basics", description: "Collections, documents, and BSON." },
        { step: 3, title: "CRUD Operations", description: "Insert, Find, Update, Delete using MongoDB shell." },
        { step: 4, title: "Mongoose", description: "Defining schemas and models in Node.js." },
        { step: 5, title: "Queries & Aggregation", description: "Advanced filtering and data aggregation." },
        { step: 6, title: "Indexing", description: "Improving query performance." }
    ]
};

// Fallback generator for skills not explicitly detailed above
const getFallbackRoadmap = (skillName) => [
    { step: 1, title: `Introduction to ${skillName}`, description: `Understand the core concepts and use cases of ${skillName}.` },
    { step: 2, title: "Environment Setup", description: `Install and configure the necessary tools for ${skillName}.` },
    { step: 3, title: "Fundamentals", description: `Learn the basic syntax, structure, and fundamentals of ${skillName}.` },
    { step: 4, title: "Intermediate Concepts", description: `Dive deeper into more advanced features and best practices.` },
    { step: 5, title: "Build Small Projects", description: `Apply your knowledge by building 2-3 small projects using ${skillName}.` },
    { step: 6, title: "Advanced Applications", description: `Integrate ${skillName} into a full-stack or complex environment.` }
];

module.exports = { roadmaps, getFallbackRoadmap };
