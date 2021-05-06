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
        const rawArticles = inject('rawArticles');
        const papers = inject('papers');
        const loading = inject('loading');
        const error = inject('error');
        
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
            let res = [];
            for (job of wichJobNumber){
                console.log(job);
                let response = await fetchData(job)

                for (item of response){
                    item.rank = parseInt(job.slice(-1));
                }
                console.log(response);
                res = res.concat(response)
            }
            rawArticles.value = res;
            
            return rawArticles;
        }

        async function getAllNews() {
            loading.value = true;

            //fetch job numbers from Firebase
            const wichJobNumber = await getMostRecentJobs();

            //fetch the news from each job from ScrapyCloud and store them in an array            
            const listado = await fetchFromScrapyCloud(wichJobNumber);

            const filteredList = await filter(listado.value);

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