<template>
  <div>
    <textarea id="tinymce-editor"></textarea>
</div>
</template>

<script setup>
const props = defineProps(['modelValue']),emit = defineEmits(['update:modelValue']);
const model =  useVmodel(props,'modelValue',emit);var editorInstance = null;
const editorSettings = {
    base_url:'tinymce',
    max_height: 500,
    max_width: 500,
    min_height: 100,
    min_width: 400,
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
console.log(666,props.modelValue)

onMounted(() => {
    tinymce.init({
        selector: 'textarea',
        ...editorSettings,
        // license_key:'nmvcfr69cp0oorg5l2g7mxybxaysnx83fvgugrt5ss5tcarg',
        license_key:'gpl',
        init_instance_callback:(editor)=>{
            editor.setContent(props.modelValue||'<p>写点啥...</p>',{format : 'raw'});
        },
        setup: (editor) => {
            editorInstance = editor;
            editor.on('change', () => {
                model.value = editor.getContent();
            });
        }
    });
});
onBeforeUnmount(() => {
    editorInstance && editorInstance.destroy();
});
</script>

<style>
#tinymce-editor {
  width: 100%;
  height: 500px;
}
</style>