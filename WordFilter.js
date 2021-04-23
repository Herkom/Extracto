app.component('wordfilter',{
    template:`
        <section class="words">
            <div class="divBox"></div>
            <h1>Listado de palabras filtradas</h1>
            <ul class="word_container">
                <li v-for="item in list">
                    <button>{{item}}</button>
                </li>
            </ul>
            <h3 v-on:click="updateGoToFeed" >Regresar</h3>
        </section>
    `,

    /* <div v-on:click="updateFeed" >
        <p>Actualizar</p>
    </div> */

    props: ['list'],
    setup(){

        const isVisible = inject('visible');
        const updateGoToFeed = inject('goToFeed');

        return {
            isVisible,
            updateGoToFeed,
        }
    }
})