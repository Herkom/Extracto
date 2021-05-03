app.component('newsfeed',{
    template: `
        <section>
            <div class="divBox"></div>
            <div v-if="loading" class="article_skeleton_container">
                <skeleton></skeleton>
            </div>
            <div v-for="(paper, index) in papers" :key="index" class="article_container">
                <papers :paper='paper' :id="index"></papers>
            </div>
            
        </section>
    `,
    setup(){
        
        const loading = ref(true);
        const error = ref(null);
        const papers = inject('papers');
        const filter = inject('filterByWordList');

        async function getMostRecentJobs(){
            let numbers = [];
            const query = await db.collection("Jobs").orderBy("timestamp", "desc").limit(3).get();
            const snapshot = query.docs;

            for(doc of snapshot){
                let data = doc.data();
                numbers.push(data.jobNumber);
            }
            
            return numbers;
        }


        async function fetchData(job){

            let lista = []
            return fetch(`https://storage.scrapinghub.com/items/${job}?format=json&apikey=5fed10557a124004a04939eb55ef0719`)
            .then(res => {
                // a non-200 response code
                if (!res.ok) {
                    // create error instance with HTTP status text
                    const error = new Error(res.statusText);
                    error.json = res.json();
                    throw error;
                }
                return res.json();
            })
            .then(json =>{
                json.forEach(el => lista.push(el.article))
                return lista;
            })
            .then( list => {
                list.forEach( el => {
                    a = ''
                    el.content.forEach(e => {
                        a = a.concat(' ', e)
                    })

                    el.content = a
                } )

                return list
            })
            .catch(err => {
                error.value = err;
                // In case a custom JSON error response was provided
                if (err.json) {
                    return err.json.then(json => {
                    // set the JSON response message
                    error.value.message = json.message;
                    });
                }
            })
        }

        async function fetchFromScrapyCloud(wichJobNumber){
            let listado = [];

            for (job of wichJobNumber){
                console.log(job);
                let response = await fetchData(job)
                listado = listado.concat(response);
            }

            return listado;
        }

        async function getAllNews() {

            //fetch job numbers from Firebase
            const wichJobNumber = await getMostRecentJobs();

            loading.value = true;

            //fetch the news from each job from ScrapyCloud and store them in an array            
            const listado = await fetchFromScrapyCloud(wichJobNumber);

            console.log(listado);

            const filteredList = await filter(listado);

            console.log(filteredList.length)
       
            papers.value = filteredList;
            
            loading.value = false;
        }

        onMounted( ()=>{
            getAllNews()
        })

        return {
            papers,
            loading,
            error,
            filter,
        };
    }

})