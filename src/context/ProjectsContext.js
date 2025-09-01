import React, { createContext, useContext, useState } from "react";

// Provide a safe default shape so destructuring doesn't crash if a component
// renders before the provider mounts (e.g., during lazy loading or error states).
const ProjectsContext = createContext({
  projects: [],
  addProject: () => {},
  updateProject: () => {},
  removeProject: () => {},
});

const initialProjects = [
  {
    id: 1,
    hospital: "Mount Sinai Hospital",
    // This is a placeholder for the hospital name, you can replace it with actual data.
    doctors: ["Ryan Tompson", "Romina Hadid"],
    bill: "$",
    completion: 60,
  },
  {
    id: 2,
    hospital: "NYC Health + Hospitals",
    // This is a placeholder for the hospital name, you can replace it with actual data.
    doctors: ["Alexander Smith"],
    bill: "$",
    completion: 10,
  },
];

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects);

  const addProject = (project) => setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
  const updateProject = (id, updates) => setProjects((prev) => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const removeProject = (id) => setProjects((prev) => prev.filter(p => p.id !== id));

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, removeProject }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}
