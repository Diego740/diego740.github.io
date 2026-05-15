import {
  FaInfoCircle, FaLightbulb, FaCheckCircle,
  FaExclamationTriangle, FaExclamationCircle, FaBug, FaQuoteLeft,
} from 'react-icons/fa';

const CALLOUT_CONFIG = {
  note:      { color: '#8a2be2', Icon: FaInfoCircle },
  info:      { color: '#8a2be2', Icon: FaInfoCircle },
  tip:       { color: '#4ade80', Icon: FaLightbulb },
  success:   { color: '#4ade80', Icon: FaCheckCircle },
  check:     { color: '#4ade80', Icon: FaCheckCircle },
  done:      { color: '#4ade80', Icon: FaCheckCircle },
  warning:   { color: '#fb923c', Icon: FaExclamationTriangle },
  caution:   { color: '#fb923c', Icon: FaExclamationTriangle },
  important: { color: '#f87171', Icon: FaExclamationCircle },
  danger:    { color: '#f87171', Icon: FaExclamationCircle },
  bug:       { color: '#f87171', Icon: FaBug },
  quote:     { color: '#a0a0a0', Icon: FaQuoteLeft },
};

const DEFAULT_CONFIG = { color: '#8a2be2', Icon: FaInfoCircle };
const CALLOUT_RE = /^\[!([\w]+)\]\s*(.*)/i;

function hastNodeToText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) return node.children.map(hastNodeToText).join('');
  return '';
}

export function ObsidianCallout({ children, node }) {
  // Use the HAST node (always available in react-markdown v10) for reliable detection
  const hastParagraph = node?.children?.[0];
  if (!hastParagraph || hastParagraph.tagName !== 'p') {
    return <blockquote>{children}</blockquote>;
  }

  // Get full text content of the first paragraph
  const paraText = hastNodeToText(hastParagraph);
  const firstLine = paraText.split('\n')[0].trim();
  const match = firstLine.match(CALLOUT_RE);
  if (!match) return <blockquote>{children}</blockquote>;

  const type = match[1].toLowerCase();
  const title = match[2].trim() || type.charAt(0).toUpperCase() + type.slice(1);
  const { color, Icon } = CALLOUT_CONFIG[type] ?? DEFAULT_CONFIG;

  // Body: remaining lines of the first paragraph + any additional paragraphs
  const bodyFromFirstPara = paraText.split('\n').slice(1).join('\n').trim();
  const additionalParas = node.children
    .slice(1)
    .map(hastNodeToText)
    .join('\n')
    .trim();
  const body = [bodyFromFirstPara, additionalParas].filter(Boolean).join('\n').trim();

  return (
    <div className="ob-callout" style={{ borderLeftColor: color }}>
      <div className="ob-callout-header" style={{ color }}>
        <Icon size={13} />
        <span>{title}</span>
      </div>
      {body && (
        <div className="ob-callout-body">
          <p>{body}</p>
        </div>
      )}
    </div>
  );
}
