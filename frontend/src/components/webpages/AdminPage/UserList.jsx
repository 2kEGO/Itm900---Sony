import React, { useState } from 'react';

const UserManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  
  // Sample user data
  const users = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah.miller@sonymusic.com",
      role: "A&R Manager",
      type: "internal",
      status: "active",
      lastActive: "Today at 2:30 PM",
      projects: 8,
      createdAt: "Jan 15, 2023"
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@sonymusic.com",
      role: "A&R Manager",
      type: "internal",
      status: "active",
      lastActive: "Today at 10:15 AM",
      projects: 6,
      createdAt: "Feb 3, 2023"
    },
    {
      id: 3,
      firstName: "Jessica",
      lastName: "Williams",
      email: "jessica.williams@sonymusic.com",
      role: "Admin",
      type: "internal",
      status: "active",
      lastActive: "Yesterday at 4:45 PM",
      projects: 12,
      createdAt: "Oct 10, 2022"
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@sonymusic.com",
      role: "Artist Relations",
      type: "internal",
      status: "inactive",
      lastActive: "March 15, 2023",
      projects: 0,
      createdAt: "Nov 22, 2022"
    },
    {
      id: 5,
      firstName: "John",
      lastName: "Smith",
      email: "john@mixingpro.com",
      role: "Mixing Engineer",
      type: "external",
      status: "active",
      lastActive: "Today at 11:20 AM",
      projects: 3,
      createdAt: "March 10, 2023",
      accessExpires: "April 15, 2023"
    },
    {
      id: 6,
      firstName: "Emily",
      lastName: "Davis",
      email: "emily@mixmaster.com",
      role: "Mixing Engineer",
      type: "external",
      status: "active",
      lastActive: "Yesterday at 3:00 PM",
      projects: 2,
      createdAt: "March 5, 2023",
      accessExpires: "June 5, 2023"
    },
    {
      id: 7,
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike@masterlab.com",
      role: "Mastering Engineer",
      type: "external",
      status: "active",
      lastActive: "March 18, 2023",
      projects: 4,
      createdAt: "Feb 20, 2023",
      accessExpires: "May 20, 2023"
    },
    {
      id: 8,
      firstName: "Robert",
      lastName: "Chen",
      email: "robert@audiophile.com",
      role: "Mastering Engineer",
      type: "external",
      status: "expired",
      lastActive: "Feb 28, 2023",
      projects: 0,
      createdAt: "Jan 15, 2023",
      accessExpires: "March 15, 2023"
    },
    {
      id: 9,
      firstName: "Alex",
      lastName: "Rivera",
      email: "alex@sunsetdreams.com",
      role: "Artist",
      type: "external",
      status: "active",
      lastActive: "Today at 9:15 AM",
      projects: 1,
      createdAt: "March 1, 2023",
      accessExpires: "March 1, 2024"
    }
  ];
  
  
  const filteredUsers = users.filter(user => {
    
    if (activeTab === 'internal' && user.type !== 'internal') return false;
    if (activeTab === 'external' && user.type !== 'external') return false;
    
    
    if (searchQuery) {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      if (!fullName.includes(query) && !user.email.toLowerCase().includes(query)) {
        return false;
      }
    }
    
  
    if (filterRole && user.role !== filterRole) return false;
    
    return true;
  });
  
  
  const uniqueRoles = [...new Set(users.map(user => user.role))];
  
  
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowUserDetailModal(true);
  };
  
  
  const UserDetailModal = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">User Details</h3>
            <button 
              onClick={() => setShowUserDetailModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
              {selectedUser.firstName[0]}{selectedUser.lastName[0]}
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-bold">{selectedUser.firstName} {selectedUser.lastName}</h4>
              <p className="text-gray-600">{selectedUser.email}</p>
              <div className="flex space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedUser.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {selectedUser.type === 'internal' ? 'Internal' : 'External'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 
                  selectedUser.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-500">Role</h5>
              <p className="text-gray-900">{selectedUser.role}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-500">Projects</h5>
              <p className="text-gray-900">{selectedUser.projects}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-500">Last Active</h5>
              <p className="text-gray-900">{selectedUser.lastActive}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h5 className="text-sm font-medium text-gray-500">Created On</h5>
              <p className="text-gray-900">{selectedUser.createdAt}</p>
            </div>
            {selectedUser.type === 'external' && (
              <div className="bg-gray-50 p-3 rounded">
                <h5 className="text-sm font-medium text-gray-500">Access Expires</h5>
                <p className={`${new Date(selectedUser.accessExpires) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                  {selectedUser.accessExpires}
                </p>
              </div>
            )}
          </div>
          
          {/* Projects list if the user has any */}
          {selectedUser.projects > 0 && (
            <div className="mb-6">
              <h5 className="font-medium mb-2">Assigned Projects</h5>
              <div className="bg-gray-50 rounded p-3">
                <p className="italic text-gray-500">
                  In a real implementation, this would show the actual projects this user has access to.
                </p>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4 flex justify-between">
            <div>
              {selectedUser.status !== 'expired' && (
                <button className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50">
                  {selectedUser.status === 'active' ? 'Deactivate User' : 'Delete User'}
                </button>
              )}
            </div>
            
            <div className="space-x-2">
              {selectedUser.type === 'external' && selectedUser.status !== 'expired' && (
                <button className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                  Edit Access
                </button>
              )}
              
              <button 
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowUserDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">A&R Collaboration Platform</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-800 h-8 w-8 rounded-full flex items-center justify-center">
              SM
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">View and manage all platform users</p>
        </div>
        
        {/* Filters & Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-1">
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('all')}
              >
                All Users
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'internal' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('internal')}
              >
                Internal
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${activeTab === 'external' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('external')}
              >
                External
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search users..."
                  className="pl-8 pr-2 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <select 
                className="p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              
              <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add New User
              </button>
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.projects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserSelect(user);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No users match your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination - Would be implemented in a real application */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
          </div>
          
          <div className="flex">
            <button className="px-3 py-1 border rounded mr-1 text-gray-500">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Next</button>
          </div>
        </div>
      </div>
      
      {/* User Detail Modal */}
      {showUserDetailModal && <UserDetailModal />}
    </div>
  );
};

export default UserManagementDashboard;
