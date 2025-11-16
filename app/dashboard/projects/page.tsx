import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Dashboard",
  description: "Manage your projects",
};

export default function ProjectsPage() {
  const projects = [
    { id: 1, name: "Website Redesign", status: "In Progress", progress: 75, team: 4 },
    { id: 2, name: "Mobile App", status: "Planning", progress: 10, team: 6 },
    { id: 3, name: "API Development", status: "Completed", progress: 100, team: 3 },
    { id: 4, name: "Marketing Campaign", status: "In Progress", progress: 45, team: 5 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track your projects</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Project List</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            New Project
          </button>
        </div>
        
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {projects.map((project) => (
            <li key={project.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.name}</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'Completed' ? 'bg-green-500' : 
                          project.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-xs font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Status: <span className={`${
                      project.status === 'Completed' ? 'text-green-600 dark:text-green-500' : 
                      project.status === 'In Progress' ? 'text-blue-600 dark:text-blue-500' : 'text-yellow-600 dark:text-yellow-500'
                    }`}>
                      {project.status}
                    </span> • Team: {project.team} members
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-700">
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}