app.component('wordfilter',{
    template:`
        <section class="words">
            <div class="divBox"></div>
            <h1>Listado de palabras filtradas</h1>
            <ul class="word_container">
                <li v-for="item in wordList">
                    <button>{{item}}</button>
                </li>
                <li><button class="">{{wordToBeAdded}}</button></li>
            </ul>

            <form>
                <input v-model="wordToBeAdded" id="wordToAdd" type="text" name="wordToAdd" maxlength="25" minlength="3" placeholder="Palabra a agregar" required>
                <button type="button" v-on:click="addWordToList">Añadir palabra</button>
                <button type="submit">Aplicar</button>
            </form>

            <h3 v-on:click="updateGoToFeed" >Regresar</h3>
        </section>
    `,
    setup(){
        const wordList = inject('wordList');
        const isVisible = inject('visible');
        const updateGoToFeed = inject('goToFeed');

        const wordToBeAdded = ref('');

        const addWordToList = (e) => {
            wordList.value.push(wordToBeAdded.value);
            wordToBeAdded.value = '';
        }

        const submit = () => {
            updateGoToFeed();
        }

        return {
            isVisible,
            updateGoToFeed,
            wordList,
            wordToBeAdded,

            addWordToList
        }
    }
})