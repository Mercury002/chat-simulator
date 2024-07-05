<template>
    <div v-if="!isUserAvailable" class="h-screen mx-auto flex flex-col justify-center max-w-[400px]">
        <h2 class="font-medium text-xl mb-3">Создать пользователя</h2>
        <form :on-submit="submitUser" class="flex gap-3 mb-6">
            <div class="relative w-full min-w-[200px] h-10">
                <input
                    v-model="userName"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" " />
                <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">Ваше имя</label>
            </div>
            <button @click.prevent="submitUser" class="py-0 px-5">Создать</button>
        </form>

        <p v-if="availableUsers.length > 0" @click="createUser" class="cursor-pointer text-md font-medium underline underline-offset-4">У вас есть профиль ?</p>
    </div>
    <div v-else class="h-screen mx-auto flex flex-col justify-center max-w-[400px]">
        <h2 class="font-medium text-2xl mb-5">Выбор пользователей</h2>

        <div v-if="availableUsers.length > 0" class="flex flex-col gap-2 mb-6">
            <div v-for="(user, index) in availableUsers" :key="index" @click="enterToChat(user)" class="border cursor-pointer rounded-lg px-4 py-1 bg-[#8B5CF6] text-white transition-colors hover:bg-[#6527F3]">{{ user.name }}</div>
        </div>

        <p @click="createUser" class="cursor-pointer text-md font-medium underline underline-offset-4">У вас нет профилья ?</p>
    </div>
</template>

<script setup>
import { useRouter  } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter()
const isUserAvailable = ref(false);
const userName = ref('');
const availableUsers = ref([])

function submitUser() {
    if (userName.value.trim() === '') {
        alert('Напишите имя')
        return
    } 

    if (!availableUsers.value) {
        availableUsers.value = []
        availableUsers.value.push({id: 1, name: userName.value})
        localStorage.setItem('currentUser', JSON.stringify(availableUsers.value.find(i => i.id === availableUsers.value.length)))
    } else {
        availableUsers.value.push({id: availableUsers.value.length + 1, name: userName.value})
        localStorage.setItem('currentUser', JSON.stringify(availableUsers.value.find(i => i.id === availableUsers.value.length)))
    }
    
    localStorage.setItem('users', JSON.stringify(availableUsers.value))
    localStorage.removeItem('visitedChat')
    router.push({ path: '/chat' })
}

function enterToChat(user) {
    localStorage.removeItem('visitedChat')
    localStorage.setItem('currentUser', JSON.stringify(user))
    router.push({ path: '/chat' })
}

function createUser() {
    isUserAvailable.value = !isUserAvailable.value
}

onMounted(() => {
    const users = localStorage.getItem('users')

    if (users) {
        availableUsers.value = JSON.parse(users)
        isUserAvailable.value = availableUsers.value.length > 0
    }


    localStorage.removeItem('currentUser')
})
</script>