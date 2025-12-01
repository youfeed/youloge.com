<template>
    <dialog ref="dialog" class="y-keyboard">
        <!-- 标题区 -->
         <div class="flex items-center justify-between">
            <div>{{ title }}</div>
            <div>
                <button @click="close">取消</button>
                <!-- <button @click="dialogRef.value.close()">确定</button> -->
            </div>
        </div>
        <!-- 展示区 -->
        <div class="flex items-center justify-center gap-1 h-20">
            <div>{{ prefix }}</div>
            <div>-</div>
            <div class="flex items-center gap-1">
                <template v-for="(_,index) in length">
                    <div class="w-7 h-7 bg-gray-300 rounded-sm flex items-center justify-center text-blue-500">{{ inputVal[index] }}</div>
                </template>
            </div>
        </div>
        <!-- 按键区 -->
        <div class="keyboard border-1 border-gray-300 rounded-md p-2">
            <div class="keyboard-grid" :class="gridClass" :style="gridStyle">
                <template v-for="item in keyboards.keys">
                    <template v-if="typeof item === 'string'">
                        <div class="key-item aspect-square"  @click="onKeyboard(item)">
                            <span>{{ item }}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="key-item"  @click="onKeyboard(item)" :style="[`grid-row: ${item.row}`,`grid-column: ${item.column}`]">
                            <span>{{ item.text }}</span>
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { onMounted, useTemplateRef, computed } from 'vue';

const inputVal = ref([]);
const dialogRef = useTemplateRef('dialog');
const props = defineProps({
    title:{
        type:String,
        default:'请输入验证码'
    },
    type: {
        type: String,
        default: 'number',
        validator: (value) => {
            return ['money', 'number', 'letter'].includes(value);
        }
    },
    prefix:{
        type:String,
        default:'验证码'
    },
    length: {
        type: [Number, String],
        default: 5
    },
    unique: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: '80'
    },
    onClose: {
        type: Function,
        default: () => { }
    },
    onConfirm:{
        type:Function,
        default:()=>{}
    }
});
// grid-column: 4;
// grid-row: 3 / 5;
// 键盘按键预设
const keyboards = computed(() => {
    let { type } = props;
    return {
        money: {
            cols: 4,
            type: 'money',
            keys: ['1', '2', '3',  '4', '5', '6', '7', '8', '9', '.', {
                text: 0,
                type: 'delete',
                row:4,
                column: '2 / 4',
            }, {
                text: '⌫',
                type: 'delete',
                row:'1 / 3',
                column: 4,
            },{
                text: '↵',
                type: 'Enter',
                row: '3 / 5',
                column: 4
            }]
        },
        number:{
            cols: 5,
            keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            type: 'number'
        },
        letter: {
            cols: 8,
            keys: [
                '2', '3', '4', '5', '6', '7', '8', '9',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
                'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 
                'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z', 
            ],
            type: 'letter'
        }
    }[type];
});

// 计算网格样式
const gridClass = computed(() => [
    'grid','gap-2',
    {
        'grid-cols-4': keyboards.value.cols === 4,
        'grid-cols-5': keyboards.value.cols === 5,
        'grid-cols-6': keyboards.value.cols === 6,
        'grid-cols-7': keyboards.value.cols === 7,
        'grid-cols-8': keyboards.value.cols === 8,
    }
]);
const gridStyle = computed(() => []);
// 关闭输入
const close = () => {
   dialogRef.value.close();
   props?.onClose();
}
// 按键点击
const onKeyboard = (item)=>{
    console.log(item)
    inputVal.value.push(item);
    if(inputVal.value.length === props.length){
        dialogRef.value.close();
        props?.onConfirm(inputVal.value.join(''));
    }
}
//
onMounted(() => {
    dialogRef.value.showModal()
});
</script>

<style>
.y-keyboard {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    border-radius: 10px;
}
.y-keyboard::backdrop{
    backdrop-filter: blur(4px);
}
.key-item{
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f1f1f1;
    border-radius: 4px;
    padding: 10px;
    user-select: none;
}
.key-item:hover{
    background: #bfe7b4;
}
</style>