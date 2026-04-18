import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'de' | 'en';

const STORAGE_KEY = 'app.language';
const SUPPORTED: AppLanguage[] = ['de', 'en'];
const DEFAULT_LANGUAGE: AppLanguage = 'de';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly current = signal<AppLanguage>(DEFAULT_LANGUAGE);

  constructor(private translate: TranslateService) {
    const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as AppLanguage | null;
    const initial: AppLanguage = stored && SUPPORTED.includes(stored) ? stored : DEFAULT_LANGUAGE;

    this.translate.addLangs(SUPPORTED);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    this.set(initial);
  }

  set(lang: AppLanguage) {
    this.current.set(lang);
    this.translate.use(lang);
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }

  get(): AppLanguage {
    return this.current();
  }
}
