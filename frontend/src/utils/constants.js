export const SEVERITY_COLORS = {
  critical: { bg: 'bg-danger/20', border: 'border-danger', text: 'text-danger-light', dot: 'bg-danger' },
  high: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-300', dot: 'bg-orange-500' },
  medium: { bg: 'bg-warning/20', border: 'border-warning', text: 'text-warning-light', dot: 'bg-warning' },
  low: { bg: 'bg-info/20', border: 'border-info', text: 'text-info-light', dot: 'bg-info' }
};

export const DETECTION_TYPES = {
  person: { label: 'Person', color: 'text-info-light', bg: 'bg-info/20', border: 'border-info' },
  fall: { label: 'Fall', color: 'text-danger-light', bg: 'bg-danger/20', border: 'border-danger' }
};

export const ZONE_RISK_COLORS = {
  critical: 'text-danger',
  high: 'text-orange-400',
  medium: 'text-warning',
  low: 'text-success'
};

export const WORKER_STATUS = {
  active: { label: 'Active', color: 'text-success', bg: 'bg-success/20' },
  in_zone: { label: 'In Zone', color: 'text-info-light', bg: 'bg-info/20' },
  off_duty: { label: 'Off Duty', color: 'text-gray-400', bg: 'bg-gray-700/50' },
  missing: { label: 'Missing', color: 'text-danger', bg: 'bg-danger/20' }
};
