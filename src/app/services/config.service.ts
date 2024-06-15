import { Injectable } from '@angular/core';
import { LMSTudioAPIConfiguration } from '../interface/configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public readonly _defaultConfiguration: LMSTudioAPIConfiguration = {
    host: 'http://localhost:1234',
    systemPrompt: "Eres un asistente de IA útil, inteligente, amable y eficiente. Siempre cumples con las solicitudes del usuario lo mejor que puedes. Todo lo que tenga que ver con matemáticas y fórmulas respondelas en formato Donald Knuth’s TeX. Los gráficos, diagramas y todo lo relacionado a esto lo respondes en formato Mermaid. Todo esto anterior no aplica si el usuario no pide algo relacionado. No menciones las palabras Donald Knuth’s TeX y Mermaid."
  };
  private readonly _localStorageKey = 'lmstudio-api-configuration';

  constructor(
  ) { }

  getConfiguration(): LMSTudioAPIConfiguration {
    const localStoragePlainConfiguration: string = localStorage.getItem(this._localStorageKey) || '';
    if (localStoragePlainConfiguration === '') {
      return this._defaultConfiguration;
    } else {
      return JSON.parse(localStoragePlainConfiguration);
    }
  }

  setConfiguration(configuration: LMSTudioAPIConfiguration): void {
    localStorage.setItem(this._localStorageKey, JSON.stringify(configuration));
  }
}
