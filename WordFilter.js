app.component('wordfilter',{
    template:`
        <section>
            <div class="divBox"></div>
            <h1>Listado de palabras filtradas</h1>
            <ul>
                <li v-for="item in list">
                    <button>{{item}}</button>
                </li>
            </ul>
            
            <h3 v-on:click="updateGoToFeed" >Regresar</h3>
        </section>
    `,
    props: ['list'],
    setup(){

        const isVisible = inject('visible');
        const updateGoToFeed = inject('goToFeed');

        return {
            isVisible,
            updateGoToFeed
        }
    }
})