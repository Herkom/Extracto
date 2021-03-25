app.component('navbar',{
    template:`
        <nav>
            <div class="navbar">
                <div class="navbar__logo">
                    <img src="img/logoExtracto.svg" alt="Extracto">
                </div>
                <div v-on:click="updateGoToFeed" class="navbar__icon">
                    <img src="img/icons/collapse_all.svg" alt="Icono de apertura o cierre de notas">
                </div>
            </div>
            <div class="gradient"></div>
        </nav>
    `,
    setup(){

        const isVisible = inject('visible');
        const updateGoToFeed = inject('goToFeed');

        return {
            isVisible,
            updateGoToFeed
        }
    }
})