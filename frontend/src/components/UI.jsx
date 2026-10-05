import { AlertCircle, Info, CheckCircle2, AlertTriangle, Inbox } from 'lucide-react';

/* ---------------------------------------------------------------- helpers */

/** Maps a 0-100 score to a semantic colour token. */
export function scoreTone(v) {
  const n = Number(v) || 0;
  if (n >= 80) return 'success';
  if (n >= 60) return 'brand';
  if (n >= 40) return 'warn';
  return 'danger';
}

export function clamp(n, min = 0, max = 100) {
  const v = Number(n);
  if (Number.isNaN(v)) return min;
  return Math.max(min, Math.min(max, v));
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d).slice(0, 10);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ------------------------------------------------------------- primitives */

export function Card({ className = '', children, as: Tag = 'section', ...rest }) {
  return (
    <Tag className={`card ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

export function PageHeader({ eyebrow, icon: Icon, title, subtitle, actions }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && (
          <span className="eyebrow">
            {Icon && <Icon size={14} />}
            {eyebrow}
          </span>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </header>
  );
}

export function Badge({ tone = '', children, className = '' }) {
  return <span className={`badge ${tone} ${className}`.trim()}>{children}</span>;
}

export function Alert({ tone = 'info', title, children }) {
  const Icon = { err: AlertCircle, info: Info, ok: CheckCircle2, warn: AlertTriangle }[tone] || Info;
  return (
    <div className={`alert ${tone}`} role={tone === 'err' ? 'alert' : 'status'}>
      <Icon size={17} />
      <div>
        {title && <b>{title} </b>}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="empty">
      <span className="e-icon"><Icon size={24} /></span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ lines = 3, tall }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {tall && <div className="skel h-lg block" />}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skel block ${i === 0 ? 'w-80' : i === lines - 1 ? 'w-40' : 'w-60'}`} />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- visuals */

export function ProgressBar({ value, tone = '' }) {
  const v = clamp(value);
  return (
    <div className="bar" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <i className={tone ? `tone-${tone}` : ''} style={{ width: `${v}%` }} />
    </div>
  );
}

export function Meter({ label, value, suffix = '%', tone }) {
  const v = clamp(value);
  const t = tone || scoreTone(v);
  return (
    <div className="meter">
      <div className="meter-top">
        <span className="m-name">{label}</span>
        <span className="m-val">{Math.round(v)}{suffix}</span>
      </div>
      <ProgressBar value={v} tone={t === 'brand' ? '' : t} />
    </div>
  );
}

/**
 * Circular progress gauge. `tone` accepts brand | success | warn | danger.
 */
export function Ring({ value, size = 132, stroke = 12, tone, label, sub, suffix = '%' }) {
  const v = clamp(value);
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (v / 100) * circumference;
  const t = tone || scoreTone(v);
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={`${Math.round(v)}${suffix}`}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className={`ring-bar tone-${t}`}
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-label">
        <div className="ring-value" style={{ fontSize: Math.round(size / 4.1) }}>
          {label !== undefined ? label : Math.round(v)}{suffix}
        </div>
        {sub && <div className="ring-sub">{sub}</div>}
      </div>
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, unit, hint, tone = '', to }) {
  const body = (
    <>
      <div className="s-top">
        <span className="s-label">{label}</span>
        {Icon && <span className="s-icon"><Icon size={19} /></span>}
      </div>
      <div className="s-value">
        {value}{unit && <span className="unit">{unit}</span>}
      </div>
      {hint && <div className="s-hint">{hint}</div>}
    </>
  );
  const cls = `stat ${tone}`.trim();
  return to
    ? <a className={cls} href={to}>{body}</a>
    : <div className={cls}>{body}</div>;
}