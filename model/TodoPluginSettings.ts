export interface TodoPluginSettings {
  dateFormat: string;
  dateTagFormat: string;
  globalDateTagFormat: string;
  globalDateFormat: string;
  openFilesInNewLeaf: boolean;
  excludedFolders: string;
}

export const DEFAULT_SETTINGS: TodoPluginSettings = {
  dateFormat: 'yyyy-MM-dd',
  dateTagFormat: '#%date%',
  globalDateTagFormat: '#tbd-%date%',
  globalDateFormat: 'kkkk-WW',
  openFilesInNewLeaf: true,
  excludedFolders: '',
};
