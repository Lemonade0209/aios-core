import { useI18n } from '../i18n/I18nContext';

export function LanguageSelect() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs font-medium uppercase text-zinc-500">
      {t('language.label')}
      <select
        className="w-auto min-w-28 py-1 text-xs normal-case"
        value={language}
        onChange={(event) => setLanguage(event.target.value === 'ko' ? 'ko' : 'en')}
      >
        <option value="en">{t('language.english')}</option>
        <option value="ko">{t('language.korean')}</option>
      </select>
    </label>
  );
}
