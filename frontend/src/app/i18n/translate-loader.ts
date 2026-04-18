import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { en } from './en';
import { de } from './de';

const bundles: Record<string, any> = { en, de };

export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(bundles[lang] ?? bundles['de']);
  }
}
