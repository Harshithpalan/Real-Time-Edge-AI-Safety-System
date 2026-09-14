import { SEVERITY_COLORS } from '../../utils/constants';

export default function SeverityBadge({ severity, size = 'sm' }) {
  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.low;

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors.bg} ${colors.text} ${sizeStyles[size]}`}>
      {severity}
    </span>
  );
}
