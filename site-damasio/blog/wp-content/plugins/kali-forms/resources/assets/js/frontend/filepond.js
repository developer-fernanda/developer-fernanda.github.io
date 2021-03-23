import * as FilePond from 'filepond';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondSettings from './filepond-settings';

FilePond.registerPlugin(FilePondPluginFileRename);
FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginFileValidateType);

// Expose FilePond to window
document.addEventListener('DOMContentLoaded', __ => {
	const FPSettings = new FilePondSettings();
	window.FilePond = FilePond;
	window.generalFilePondSettings = FPSettings;
})
