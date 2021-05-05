app.component('wordfilter',{
    template:`
        <section class="words">
            <div class="divBox"></div>
            <h1>Listado de palabras filtradas</h1>
            
            <form>
                <input v-model="wordTobeAddedToTheList" id="wordToAdd" type="text" name="wordToAdd" maxlength="25" minlength="3" placeholder="Palabra a agregar" required>
                <button type="button" v-on:click="addWordToList(wordTobeAddedToTheList)">Añadir palabra</button>
                <button type="button" v-on:click="apply">Aplicar</button>
            </form>
            
            <ul class="word_container">
                <li v-for="item, index in listOfWordsToBeAdded" class='toBeAdded'>
                    <button>{{item}}</button>
                </li>
                <li v-for="(item, index) in wordList" v-on:click="addWordToRemoveList(item)" :id=item>
                    <button>{{item}}</button>
                </li>
            </ul>
            
        </section>
    `,
    setup(){
        const wordList = inject('wordList');
        const visible = inject('visible');

        const rawArticles = inject('rawArticles');
        const papers = inject('papers');
        const loading = inject('loading');

        const wordTobeAddedToTheList = inject('wordTobeAddedToTheList')
        const listOfWordsToBeAdded = inject('listOfWordsToBeAdded');
        
        const updateGoToFeed = inject('goToFeed');
        const filter = inject('filterByWordList');
        
        let listOfWordsToBeRemoved = [];

        const addWordToRemoveList = (word) => {
            if (listOfWordsToBeRemoved.includes(word)){
                wordIndex = listOfWordsToBeRemoved.indexOf(word); 
                listOfWordsToBeRemoved.splice(wordIndex,1)
                document.getElementById(`${word}`).firstChild.style.backgroundColor = "royalblue";
            }else{
                listOfWordsToBeRemoved.push(word);
                document.getElementById(`${word}`).firstChild.style.backgroundColor = "#5c5bc8ad";
            }
        }

        const addWordToList = (word) => {
            listOfWordsToBeAdded.value.push(word);
            document.getElementById("wordToAdd").value = "";
            wordTobeAddedToTheList.value = '';
        }

        const apply = async () => {

            loading.value = true;
            
            updateGoToFeed();

            for(item of listOfWordsToBeAdded.value){
               localStorage.setItem(`extract_${item}_`, item);
            }
            listOfWordsToBeAdded.value = [];

            for(item of listOfWordsToBeRemoved){
                localStorage.removeItem(`extract_${item}_`);
                document.getElementById(`${item}`).firstChild.style.backgroundColor = "royalblue";
            }
            listOfWordsToBeRemoved = [];

            wordList.value = [];
            for(var i = 0; i < localStorage.length; i++){
                wordList.value.push(localStorage.getItem(localStorage.key(i)));
            }
        
            const filteredList = await filter(rawArticles.value);

            papers.value = filteredList;

            loading.value = false;

        }
        
        return {
            wordList,
            visible,
            papers,

            wordTobeAddedToTheList,
            listOfWordsToBeAdded,

            filter,
            updateGoToFeed,
            
            listOfWordsToBeRemoved,

            addWordToList,
            addWordToRemoveList,
            apply
        }
    }
})