app.component('wordfilter',{
    template:`
        <section class="words">
            <div class="divBox"></div>
            <h3>Listado de palabras filtradas</h3>
            
            <form>
                <input v-model="wordTobeAddedToTheList" id="wordToAdd" type="text" name="wordToAdd" maxlength="25" minlength="3" placeholder="Palabra a agregar" @keydown.enter.stop.prevent="stopDefaultBehavior($evt)" required>
                <button type="button" v-on:click="addWordToList(wordTobeAddedToTheList)">Añadir palabra</button>
                <button type="button" v-on:click="apply">Aplicar cambios</button>
            </form>
            
            <ul class="word_container">
                <li v-for="item, index in listOfWordsToBeAdded" class='toBeAdded'>
                    <button>{{item[0]}}</button>
                </li>
                <li v-for="(item, index) in wordList" v-on:click="addWordToRemoveList(item)" :id=item[0]>
                    <button>{{item[0]}}</button>
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
            console.log(word)
            console.log(listOfWordsToBeRemoved.includes(word))

            if (listOfWordsToBeRemoved.includes(word)){
                wordIndex = listOfWordsToBeRemoved.indexOf(word);
                console.log(wordIndex)
                listOfWordsToBeRemoved.splice(wordIndex,1)
                document.getElementById(`${word}`).firstChild.style.backgroundColor = "royalblue";
            }else{
                listOfWordsToBeRemoved.push(word);
                document.getElementById(`${word}`).firstChild.style.backgroundColor = "#5c5bc8ad";
            }
        }

        const addWordToList = (word) => {
            listOfWordsToBeAdded.value.push([word, 6]);

            console.log(listOfWordsToBeAdded.value)
            document.getElementById("wordToAdd").value = "";
            wordTobeAddedToTheList.value = '';
        }

        const apply = async () => {

            loading.value = true;
            
            updateGoToFeed();

            for(item of listOfWordsToBeAdded.value){
               localStorage.setItem(`extract_${item[0]}_`, JSON.stringify(item))
            }
            listOfWordsToBeAdded.value = [];

            for(item of listOfWordsToBeRemoved){
                localStorage.removeItem(`extract_${item[0]}_`);

                console.log(item[0])
                document.getElementById(`${item[0]}`).firstChild.style.backgroundColor = "royalblue";
            }
            listOfWordsToBeRemoved = [];

            wordList.value = [];
            for(var i = 0; i < localStorage.length; i++){
                wordList.value.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
            }
        
            const filteredList = await filter(rawArticles.value);

            papers.value = filteredList;

            loading.value = false;

        }

        const stopDefaultBehavior = (evt) => {
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
            stopDefaultBehavior,
            apply,
        }
    }
})