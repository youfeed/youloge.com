<template>
  <div>
    <h1>TinyMCE Editor</h1>
    <textarea id="tinymce-editor" ref="tinymceEditor"></textarea>
</div>
</template>

<script setup>
const props = defineProps(['content']),emit = defineEmits(['change']);
const editorSettings = {
    base_url:'tinymce',
    height: 500,
    menubar: false,
    plugins: 'code quickbars preview searchreplace autolink fullscreen image link media codesample table charmap advlist lists wordcount autoresize',
    toolbar: 'code undo redo | forecolor backcolor bold italic underline strikethrough | indent2em alignleft aligncenter alignright alignjustify outdent indent | link bullist numlist image table codesample | formatselect fontselect fontsizeselect',
    images_upload_url: 'https://upload.qiniu.com',
    images_upload_handler: (blobInfo, progress)=>new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'https://upload.qiniu.com');
        xhr.upload.onprogress = (e) => {
            progress(e.loaded / e.total * 100);
        };
        xhr.onerror = () => {
            reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };
        xhr.onload = () => {
            if (xhr.status === 403) {
                reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                reject('HTTP Error: ' + xhr.status);
                return;
            }
            const json = JSON.parse(xhr.responseText);
            if (!json || typeof json.data.href != 'string') {
                reject('Invalid JSON: ' + xhr.responseText);
                return;
            }
            resolve(json.data.href);
        }
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        formData.append('token', 'images_upload_token');
        xhr.send(formData);
    }),
};
onMounted(() => {
    console.log('Editor mounted',tinymce);
    tinymce.init({
        selector: 'textarea',
        ...editorSettings,
        // license_key:'nmvcfr69cp0oorg5l2g7mxybxaysnx83fvgugrt5ss5tcarg',
        license_key:'gpl',
        setup: (editor) => {
            console.dir(editor);
            editor.on('change', () => {
                console.log('Editor content changed:', editor.getContent());
            });
        }
    });
});
onBeforeUnmount(() => {
//   tinymce.remove('#tinymce-editor');
});
</script>

<style>
#tinymce-editor {
  width: 100%;
  height: 500px;
}
</style>