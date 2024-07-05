<template>
    <div class="container h-screen flex flex-col w-full">
        <h1>Чат</h1>
        <div class="mt-auto py-2 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <!-- <div v-for="(msg, index) in messages" :key="index" class="max-w-[550px] border py-2 px-3 rounded-xl rounded-br-none ml-auto flex flex-col"> -->
                <div v-for="(msg, index) in messages" :key="index" :class="checkUser(msg) ? 'max-w-[550px] border py-2 px-3 rounded-xl rounded-br-none ml-auto flex flex-col': 'max-w-[550px] border py-2 px-3 rounded-xl rounded-bl-none mr-auto flex flex-col'">
                    <span :class="checkUser(msg) ? 'ml-auto font-semibold' : 'mr-auto font-semibold'">{{ msg.userName }}</span>
                    <p :class="checkUser(msg) ? 'text-end' : 'text-start'">{{ msg.text }}</p>
                    <span :class="checkUser(msg) ? 'mt-2 text-xs font-medium text-[gray] ml-auto' : 'mt-2 text-xs font-medium text-[gray] mr-auto'">{{ formattedDate(msg.date) }}</span>
                </div>
            </div>
            <form onsubmit="sendMsg" class="flex">
                <input v-model="msg" class="w-full outline-none px-3 py-1 border rounded-lg rounded-r-none" type="text" placeholder="Сообщения">
                <button @click.prevent="sendMsg" class="rounded-l-none">Отправить</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import 'moment/locale/ru'
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { useRouter  } from 'vue-router';
import { sendMessage, getMessages } from '@/services/chatService';

const msg = ref('')
const router = useRouter()
const messages = ref(getMessages())
const currentUser = ref({})
moment.locale('ru');

function formattedDate(date) {
    return moment(date).format('HH:mm, DD MMMM');
}

function checkUser(msg) {
    return msg.userId === currentUser.value.id
}

function sendMsg() {
    if (msg.value.trim() === '') {
        alert('Напишите хоть что-то');
        return;
    }

    if (msg.value.trim()) {
        const newMessage = {
            id: Date.now(),
            text: msg.value,
            userId: currentUser.value.id,
            userName: currentUser.value.name,
            date: new Date().toISOString()
        };
        sendMessage(newMessage);
        msg.value = '';
        updateMessages();
        nextTick(() => {
            window.scrollTo(0, document.documentElement.scrollHeight)
        })
    } 
}

function updateMessages() {
    messages.value = getMessages();
}


onMounted(() => {
    const msgs = localStorage.getItem('msgs')
    const cUser = localStorage.getItem('currentUser')
    
    localStorage.setItem('visitedChat', 'true')

    if (msgs) messages.value = JSON.parse(msgs)
    if (cUser) currentUser.value = JSON.parse(cUser);
    else router.push('/users')

    window.addEventListener('storage', updateMessages);
})

onUnmounted(() => {
    window.removeEventListener('storage', updateMessages);
})
</script>