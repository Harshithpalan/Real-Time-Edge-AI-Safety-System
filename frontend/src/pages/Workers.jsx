import { useState, useEffect } from 'react';
import { workersApi } from '../api/client';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { formatTimestamp } from '../utils/helpers';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({ name: '', badgeId: '', zone: 'zone-1', role: 'operator' });

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const res = await workersApi.getAll();
      setWorkers(res.workers);
    } catch (err) {
      console.error('Failed to load workers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await workersApi.update(editingWorker.id, formData);
      } else {
        await workersApi.create(formData);
      }
      setShowForm(false);
      setEditingWorker(null);
      setFormData({ name: '', badgeId: '', zone: 'zone-1', role: 'operator' });
      loadWorkers();
    } catch (err) {
      console.error('Failed to save worker:', err);
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({ name: worker.name, badgeId: worker.badgeId, zone: worker.zone, role: worker.role });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this worker?')) return;
    try {
      await workersApi.remove(id);
      loadWorkers();
    } catch (err) {
      console.error('Failed to delete worker:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-warning-light" />
          <h1 className="text-xl font-bold text-white">Workers</h1>
        </div>
        <button
          onClick={() => { setEditingWorker(null); setFormData({ name: '', badgeId: '', zone: 'zone-1', role: 'operator' }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-info text-white rounded-lg hover:bg-info-dark transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Worker
        </button>
      </div>

      <div className="bg-panel border border-gray-700/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Badge ID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Zone</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Last Seen</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-b border-gray-700/30 hover:bg-surface-light transition-colors">
                <td className="px-4 py-3 text-sm text-white font-medium">{worker.name}</td>
                <td className="px-4 py-3 text-sm text-gray-300 font-mono">{worker.badgeId}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{worker.zone}</td>
                <td className="px-4 py-3 text-sm text-gray-300 capitalize">{worker.role.replace('_', ' ')}</td>
                <td className="px-4 py-3"><StatusBadge status={worker.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatTimestamp(worker.lastSeen)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(worker)} className="p-1.5 hover:bg-surface-light rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => handleDelete(worker.id)} className="p-1.5 hover:bg-danger/20 rounded-lg transition-colors ml-1">
                    <Trash2 className="w-4 h-4 text-danger" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {workers.length === 0 && (
          <div className="p-8 text-center text-gray-500">No workers registered</div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingWorker(null); }}
        title={editingWorker ? 'Edit Worker' : 'Add Worker'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-surface-light border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-info"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Badge ID</label>
            <input
              type="text"
              value={formData.badgeId}
              onChange={(e) => setFormData(prev => ({ ...prev, badgeId: e.target.value }))}
              className="w-full bg-surface-light border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-info"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Zone</label>
            <select
              value={formData.zone}
              onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value }))}
              className="w-full bg-surface-light border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-info"
            >
              <option value="zone-1">Zone 1 - Assembly Line A</option>
              <option value="zone-2">Zone 2 - Warehouse Bay 3</option>
              <option value="zone-3">Zone 3 - Loading Dock</option>
              <option value="zone-4">Zone 4 - Chemical Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full bg-surface-light border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-info"
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="forklift_driver">Forklift Driver</option>
              <option value="maintenance">Maintenance</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingWorker(null); }}
              className="flex-1 px-4 py-2 bg-surface-light text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-info text-white rounded-lg hover:bg-info-dark transition-colors text-sm"
            >
              {editingWorker ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
