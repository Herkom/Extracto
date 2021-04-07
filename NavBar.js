app.component('navbar',{
    template:`
        <nav>
            <div class="navbar">
                <div class="navbar__logo">
                    <img src="img/logoExtracto.svg" alt="Extracto">
                </div>
                <div v-on:click="updateGoToFeed" class="navbar__icon">
                    <img src="img/icons/filter.svg" alt="Icono de filtro">
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