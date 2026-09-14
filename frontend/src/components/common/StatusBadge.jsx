export default function StatusBadge({ status, size = 'sm' }) {
  const statusStyles = {
    online: 'bg-success/20 text-success-light',
    offline: 'bg-gray-700/50 text-gray-400',
    alert: 'bg-danger/20 text-danger-light',
    active: 'bg-success/20 text-success-light',
    inactive: 'bg-gray-700/50 text-gray-400'
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${statusStyles[status] || statusStyles.offline} ${sizeStyles[size]}`}>
      {status}
    </span>
  );
}
