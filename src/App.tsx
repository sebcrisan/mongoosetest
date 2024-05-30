import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface Project {
  _id: string;
  name: string;
  project_number: number;
  location: string;
  device_count: number;
}

const App: React.FC = () => {
  const [projectId, setProjectId] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>("");

  const fetchProjectById = () => {
    axios
      .get<Project>(`/api/projects/${projectId}`)
      .then((response) => {
        setProject(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
        setProject(null);
        setError("Project not found");
      });
  };

  const fetchAllProjects = () => {
    axios
      .get<Project[]>("/api/projects")
      .then((response) => {
        setProjects(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError("Could not fetch projects");
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectId(e.target.value);
  };

  const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
    return (
      <div>
        <h2>All Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <p>ID: {project._id}</p>
              <p>Name: {project.name}</p>
              <p>Project Number: {project.project_number}</p>
              <p>Location: {project.location}</p>
              <p>Device Count: {project.device_count}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1>Fetch Project by ID</h1>
      <input
        type="text"
        placeholder="Enter Project ID"
        value={projectId}
        onChange={handleInputChange}
      />
      <button onClick={fetchProjectById}>Fetch Project</button>
      {project && (
        <div>
          <h2>Project Details</h2>
          <p>ID: {project._id}</p>
          <p>Name: {project.name}</p>
          <p>Project Number: {project.project_number}</p>
          <p>Location: {project.location}</p>
          <p>Device Count: {project.device_count}</p>
        </div>
      )}
      {error && <p>{error}</p>}
      <h1>Fetch All Projects</h1>
      <button onClick={fetchAllProjects}>Fetch All Projects</button>
      {projects.length > 0 && <ProjectList projects={projects} />}
    </div>
  );
};

export default App;
