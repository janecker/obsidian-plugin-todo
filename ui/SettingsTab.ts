import { App, PluginSettingTab, Setting } from 'obsidian';
import { DateTime } from 'luxon';
import TodoPlugin from 'main';
import { DEFAULT_SETTINGS } from '../model/TodoPluginSettings';

export class SettingsTab extends PluginSettingTab {
  private plugin: TodoPlugin;

  constructor(app: App, plugin: TodoPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const currentSettings = this.plugin.getSettings();

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Obsidian TODO Settings' });

    const tagFormatSetting = new Setting(containerEl);
    tagFormatSetting
      .setName('Date tag format')
      .setDesc(this.dateTagFormatDescription())
      .addText((text) =>
        text.setPlaceholder(currentSettings.dateTagFormat).onChange(async (dateTagFormat) => {
          // TODO: refactor this
          if (dateTagFormat.length === 0) {
            dateTagFormat = DEFAULT_SETTINGS.dateTagFormat;
          }

          if (!this.validateDateTag(dateTagFormat)) {
            tagFormatSetting.descEl.empty();
            tagFormatSetting.setDesc(this.dateTagFormatDescription('Date tag must include %date% token.'));
            return;
          }

          tagFormatSetting.descEl.empty();
          tagFormatSetting.setDesc(this.dateTagFormatDescription());

          this.plugin.updateSettings({ ...currentSettings, dateTagFormat });
        }),
      );

    const dateFormatSetting = new Setting(containerEl);
    dateFormatSetting
      .setName('Date format')
      .setDesc(this.dateFormatDescription())
      .addText((text) =>
        text.setPlaceholder(currentSettings.dateFormat).onChange(async (dateFormat) => {
          // TODO: refactor this
          if (dateFormat.length === 0) {
            dateFormat = DEFAULT_SETTINGS.dateFormat;
          }

          if (!this.validateDateFormat(dateFormat)) {
            dateFormatSetting.descEl.empty();
            dateFormatSetting.setDesc(this.dateTagFormatDescription('Invalid date format.'));
            return;
          }

          dateFormatSetting.descEl.empty();
          dateFormatSetting.setDesc(this.dateTagFormatDescription());

          this.plugin.updateSettings({ ...currentSettings, dateFormat });
        }),
      );

    const globalFormatSetting = new Setting(containerEl);
    globalFormatSetting
      .setName('Global date tag format')
      .setDesc(this.dateTagFormatDescription())
      .addText((text) =>
        text.setPlaceholder(currentSettings.globalDateTagFormat).onChange(async (globalDateTagFormat) => {
          // TODO: refactor this
          if (globalDateTagFormat.length === 0) {
            globalDateTagFormat = DEFAULT_SETTINGS.globalDateTagFormat;
          }

          if (!this.validateDateTag(globalDateTagFormat)) {
            globalFormatSetting.descEl.empty();
            globalFormatSetting.setDesc(this.dateTagFormatDescription('Date tag must include %date% token.'));
            return;
          }

          globalFormatSetting.descEl.empty();
          globalFormatSetting.setDesc(this.dateTagFormatDescription());

          this.plugin.updateSettings({ ...currentSettings, globalDateTagFormat });
        }),
      );

    const globalDateFormatSetting = new Setting(containerEl);
    globalDateFormatSetting
      .setName('Date format (global tag)')
      .setDesc(this.dateFormatDescription())
      .addText((text) =>
        text.setPlaceholder(currentSettings.globalDateFormat).onChange(async (globalDateFormat) => {
          // TODO: refactor this
          if (globalDateFormat.length === 0) {
            globalDateFormat = DEFAULT_SETTINGS.dateFormat;
          }

          if (!this.validateDateFormat(globalDateFormat)) {
            dateFormatSetting.descEl.empty();
            dateFormatSetting.setDesc(this.dateTagFormatDescription('Invalid date format.'));
            return;
          }

          dateFormatSetting.descEl.empty();
          dateFormatSetting.setDesc(this.dateTagFormatDescription());

          this.plugin.updateSettings({ ...currentSettings, globalDateFormat });
        }),
      );

    const excludedFoldersSetting = new Setting(containerEl);
    excludedFoldersSetting
      .setName('Excluded folders')
      .setDesc(this.dateFormatDescription())
      .addText((text) =>
        text.setPlaceholder(currentSettings.excludedFolders).onChange(async (excludedFolders) => {
          // TODO: refactor this
          if (excludedFolders.length === 0) {
            excludedFolders = DEFAULT_SETTINGS.dateFormat;
          }

          if (!this.validateExcludedFolders(excludedFolders)) {
            excludedFoldersSetting.descEl.empty();
            excludedFoldersSetting.setDesc(this.dateTagFormatDescription('TBD: Invalid date format.'));
            return;
          }

          excludedFoldersSetting.descEl.empty();
          excludedFoldersSetting.setDesc(this.dateTagFormatDescription());

          this.plugin.updateSettings({ ...currentSettings, excludedFolders });
        }),
      );

    new Setting(containerEl)
      .setName('Open files in a new leaf')
      .setDesc(
        'If enabled, when opening the file containing a TODO that file will open in a new leaf. If disabled, it will replace the file that you currently have open.',
      )
      .addToggle((toggle) => {
        toggle.setValue(currentSettings.openFilesInNewLeaf);
        toggle.onChange(async (openFilesInNewLeaf) => {
          this.plugin.updateSettings({ ...currentSettings, openFilesInNewLeaf });
        });
      });
  }

  private dateTagFormatDescription(error?: string): DocumentFragment {
    const el = document.createDocumentFragment();
    el.appendText('The format in which the due date is included in the task description.');
    el.appendChild(document.createElement('br'));
    el.appendText('Must include the %date% token.');
    el.appendChild(document.createElement('br'));
    el.appendText("To configure the format of the date, see 'Date format'.");
    if (error != null) {
      el.appendChild(document.createElement('br'));
      el.appendText(`Error: ${error}`);
    }
    return el;
  }

  private dateFormatDescription(error?: string): DocumentFragment {
    const el = document.createDocumentFragment();
    el.appendText('Dates in this format will be recognised as due dates.');
    el.appendChild(document.createElement('br'));

    const a = document.createElement('a');
    a.href = 'https://moment.github.io/luxon/#/formatting?id=table-of-tokens';
    a.text = 'See the documentation for supported tokens.';
    a.target = '_blank';
    el.appendChild(a);

    if (error != null) {
      el.appendChild(document.createElement('br'));
      el.appendText(`Error: ${error}`);
    }
    return el;
  }

  private validateDateTag(dateTag: string): boolean {
    if (dateTag.length === 0) {
      return true;
    }
    return dateTag.includes('%date%');
  }

  private validateDateFormat(dateFormat: string): boolean {
    if (dateFormat.length === 0) {
      return true;
    }
    const expected = DateTime.fromISO('2020-05-25');
    const formatted = expected.toFormat(dateFormat);
    const parsed = DateTime.fromFormat(formatted, dateFormat);
    return parsed.hasSame(expected, 'day') && parsed.hasSame(expected, 'month') && parsed.hasSame(expected, 'year');
  }

  private validateExcludedFolders(excludedFolders: string): boolean{
    return true;
  }
}
