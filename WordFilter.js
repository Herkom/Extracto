app.component('wordfilter',{
    template:`
        <section class="words">
            <div class="divBox"></div>
            <h3>Listado de palabras filtradas</h3>
            
            <form>
                <div class="addBox">
                    <input class="addField" v-model="wordTobeAddedToTheList" id="wordToAdd" type="text" name="wordToAdd" maxlength="25" minlength="3" placeholder="Palabra a agregar" @keydown.enter.stop.prevent="stopDefaultBehavior($evt)" required>
                    <button class="addButton" type="button" v-on:click="addWordToList(wordTobeAddedToTheList)">+</button>
                </div>
                <button class="applyButton" type="button" v-on:click="apply">Aplicar cambios</button>
            </form>
            
            <ul class="word_container">
                <li v-for="item, index in listOfWordsToBeAdded" class='toBeAdded'>{{item[0]}}</li>
                <li v-for="(item, index) in wordList" v-on:click="addWordToRemoveList(item)" :class="'level'+item[1].toString()" :id=item[0]>{{item[0]}}</li>
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
            if (listOfWordsToBeRemoved.includes(word[0])){
                wordIndex = listOfWordsToBeRemoved.indexOf(word[0]);
                listOfWordsToBeRemoved.splice(wordIndex,1)
                document.getElementById(`${word[0]}`).classList.remove("removeWord");
            }else{
                listOfWordsToBeRemoved.push(word[0]);
                document.getElementById(`${word[0]}`).classList.add("removeWord");
            }
        }

        const addWordToList = (word) => {
            listOfWordsToBeAdded.value.push([word, 10]);
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
                document.getElementById(`${item[0]}`).firstChild.style.backgroundColor = "royalblue";
            }
            listOfWordsToBeRemoved = [];

            wordList.value = [];
            for(var i = 0; i < localStorage.length; i++){
                wordList.value.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                wordList.value.sort(function(a, b){return b[1] - a[1]});
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