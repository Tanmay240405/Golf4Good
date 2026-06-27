import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Shield, UserX, UserCheck } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
      await adminService.updateUser(id, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
          <p className="text-text-secondary">View, search, and manage platform users.</p>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
             <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Joined</th>
                  <th className="p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <motion.tr 
                      key={user.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 text-white font-medium">{user.name}</td>
                      <td className="p-4 text-text-secondary">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-white/10 text-white border border-white/10'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleRoleToggle(user.id, user.role)}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"
                          title="Toggle Role"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-error/10 hover:bg-error/20 rounded-lg text-error transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-text-muted">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
