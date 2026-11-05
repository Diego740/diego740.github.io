import './LanguageSwitcher.css';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation('common');

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', language);
    }
  };

  const languages = [
    {
      code: 'es',
      flag: 'es',
      title: t('language.spanish'),
      aria: t('language.switchToEs')
    },
    {
      code: 'en',
      flag: 'gb',
      title: t('language.english'),
      aria: t('language.switchToEn')
    }
  ];

  return (
    <div className={`lang-toggle ${compact ? 'compact' : ''}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => handleLanguageChange(language.code)}
          className={i18n.language === language.code ? 'active' : ''}
          aria-label={language.aria}
          title={language.title}
        >
          <span className={`fi fi-${language.flag}`}></span>
        </button>
      ))}
    </div>
  );
}
