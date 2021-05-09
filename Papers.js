app.component('papers',{
    template: `
        <article class="article" :class="isOpen ? 'open' : 'closed'" :id=id>
            <section class="article__data">
                <div class="dataContainer">
                    <div class="origin">
                        <img :src=" './img/icons/' + paper.origen + '.png' " alt="Icono de {{paper.origen}}">
                        <p>{{paper.origen}}</p>
                    </div>
                    <div class="dateANDauthor">
                        <p v-for="data in paper.date_and_or_author">{{data}}</p>
                    </div>
                </div>
            </section>
            <div class="icon">
                <a>
                    <img v-on:click="toggleOpenOrClose(id)" src="img/icons/collapse_all.svg" alt="Icono de apertura o cierre de notas">
                </a>
            </div>
            <section class="article__titleANDsummary">
                <h2 class="article__title" v-on:click="toggleOpenOrClose">{{paper.title[0]}}</h2>
                <h3 class="article__summary">{{ paper.summary ? paper.summary[0]: ''}}</h3>
            </section>
            <section class="article__containerContent">
                <div class="content">{{paper.content}}</div>
            </section>
            <footer class="article__link">
                <a target="_blank" rel="noopener" rel="noreferrer" :href="paper.link">{{paper.link}}</a>
            </footer>
        </article>
    `,
    
    props: ['paper', 'id'],

    setup(){

        const isOpen = ref(false)

        function toggleOpenOrClose(id){
            isOpen.value = !isOpen.value

            if(typeof(id) == 'number'){
                let ele = document.getElementById(id);
                let navBarHeight = document.getElementById('navbar').offsetHeight
                window.scrollTo(ele.offsetLeft, ele.offsetTop - navBarHeight);
            } 
            
        }        

        return {
            toggleOpenOrClose,
            isOpen
        }
    }
})