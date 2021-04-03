app.component('newsfeed',{
    template: `
        <section>
            <div class="divBox"></div>
            <div v-for="(paper, index) in papers" :key="index" class="article_container">
                <papers :paper='paper' :id="index"></papers>
            </div>
        </section>
    `,
    setup(){
        const papers = ref([]);
        const loading = ref(true);
        const error = ref(null);

        function fetchData() {
            let listado = [];
            loading.value = true;
            return fetch('https://storage.scrapinghub.com/items/515196/1/2?format=json&apikey=5fed10557a124004a04939eb55ef0719')
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
            .then(json => {
                // set the response data
                json.forEach(el => listado.push(el.article))
                return listado;
            })
            .then( list => {
                
                list.forEach( el => {
                    a = ''
                    el.content.forEach(e => {
                        a = a.concat(' ', e)
                    })

                    el.content = a
                } )

                papers.value = list;
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
            .then(() => {
                loading.value = false;
                }
            );
        }

        onMounted( ()=>{
            fetchData()
        })

        return {
            papers,
            loading,
            error
        };
    }

})