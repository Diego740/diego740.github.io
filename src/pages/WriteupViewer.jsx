import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaLinux, FaWindows, FaCopy, FaCheck } from 'react-icons/fa';
import { writeups } from '../config/writeups';
import { preprocessObsidianMarkdown } from '../utils/markdownPreprocess';
import { ObsidianCallout } from '../components/ObsidianCallout';
import styles from './WriteupViewer.module.css';
import 'highlight.js/styles/atom-one-dark.css';

const DIFFICULTY_COLORS = {
  Easy:   '#4ade80',
  Medium: '#fb923c',
  Hard:   '#f87171',
  Insane: 'var(--accent-color)',
};

function OsIcon({ os }) {
  if (os === 'Linux')   return <FaLinux size={14} />;
  if (os === 'Windows') return <FaWindows size={14} />;
  return null;
}

function CodeBlock({ children, ...props }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = children?.props?.children;
    const text = typeof code === 'string' ? code : String(code ?? '');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.codeWrapper}>
      <button
        className={`${styles.copyBtn}${copied ? ` ${styles.copied}` : ''}`}
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <FaCheck size={11} /> : <FaCopy size={11} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
}

const mdComponents = { blockquote: ObsidianCallout, pre: CodeBlock };

function WriteupViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('cybersecurity');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const writeup = writeups.find((w) => w.id === id);

  useEffect(() => {
    if (!writeup || writeup.status === 'active' || !writeup.file) {
      navigate('/cybersecurity', { replace: true });
      return;
    }

    setLoading(true);
    fetch(writeup.file)
      .then((res) => res.text())
      .then((raw) => {
        setContent(preprocessObsidianMarkdown(raw));
        setLoading(false);
      });
  }, [writeup, navigate]);

  if (!writeup || loading) return null;

  return (
    <section className={`section-container ${styles.section}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <button className={styles.back} onClick={() => navigate('/cybersecurity')}>
          <FaArrowLeft size={11} />
          {t('writeups.backButton')}
        </button>

        <header className={styles.header}>
          <h1>{writeup.title}</h1>
          <div className={styles.meta}>
            <span className={styles.osTag}>
              <OsIcon os={writeup.os} />
              {writeup.os}
            </span>
            <span className={styles.dot}>·</span>
            <span style={{ color: DIFFICULTY_COLORS[writeup.difficulty], fontWeight: 600 }}>
              {writeup.difficulty}
            </span>
            <span className={styles.dot}>·</span>
            <span className={styles.date}>{writeup.date}</span>
          </div>
        </header>

        <div className={styles.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={mdComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </motion.div>
    </section>
  );
}

export default WriteupViewer;
