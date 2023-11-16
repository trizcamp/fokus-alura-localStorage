const taskListContainer = document.querySelector('.app__section-task-list')
const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task') //toggle = altermar 
const formLabel = document.querySelector('.app__form-label')

const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')
const btnCancelar =  document.querySelector('.app__form-footer__button--cancel')
const btnDeletar = document.querySelector('.app__form-footer__button--delete')

const deleteTarefaConcluida = document.querySelector('#btn-remover-concluidas')
const deleteAllTask = document.querySelector('#btn-remover-todas')

const textArea = document.querySelector('.app__form-textarea')
const taskAtiveDescription = document.querySelector('.app__section-active-task-description')
const localStorageTarefas = localStorage.getItem('tarefas')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

//icone de check svg
const taskIconSvg =  `
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
<path
    d = "M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L19 16.17192"
    fill="#01080E" />
</svg>
`
let tarefaSelecionada = null
let itemTarefaSelecionada = null 

let tarefaEmEdicao = null
let paragraphEmEdicao = null

const selecionaTarefaParaEditar = (tarefa , elemento) => {
   if(tarefaEmEdicao == tarefa){
    limparForm()
    return
   }
   formLabel.textContent = "Editando Tarefa"
   tarefaEmEdicao = tarefa
   paragraphEmEdicao = elemento
   textArea.value = tarefa.descricao
   formTask.classList.remove('hidden')
}


const selecionaTarefa = (tarefa, elemento) => {
    if(tarefa.concluida){
        return //se for verdadeira vai sair da função, se a tarefa for concluida nao vai conseguir selecionar 
    }
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })

    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }

    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

//função para limpar conteudo do formulario
const limparForm = () => {
    tarefaEmEdicao = null //evitando que uma tarefa fique em cima da outra
    paragraphEmEdicao = null
    textArea.value = '' //pegou valor da textarea e deixou vazio
    formTask.classList.add('hidden')
}

function createTask (tarefa){
    const li = document.createElement('li'); //criando item de lista no html
    //criando classe para estilizar
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg //add icon no html

    const paragraph = document.createElement('p') //criando paragrafo
    paragraph.classList.add('app__section-task-list-item-description')

    //recebe a descrição dentro do paragrafo
    paragraph.textContent = tarefa.descricao

    const button = document.createElement('button')
    //criacao do botao de editar
    button.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    li.onclick = () => {
        selecionaTarefa(tarefa , li )
    }

    svgIcon.addEventListener( 'click', (evento) =>{
        if(tarefa == tarefaSelecionada){ //depois que a terefa for selecionada ele vai poder ser concluida
            evento.stopPropagation()
            button.setAttribute('disable', true)
            li.classList.add("app__section-task-list-item-complete") 
            tarefaSelecionada.concluida = true
            updateLocalStorage()
        }
       
    })

    if(tarefa.concluida){
        button.setAttribute('disables', true)
        li.classList.add("app__section-task-list-item-complete")
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)
    button.appendChild(editIcon)

    button.addEventListener("click", (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })

    return li
}

tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

// adicionando tarefas
toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando Tarefa'
    formTask.classList.toggle('hidden') //quando clicar dnv ira desaparecer

})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)) //transforma string em objeto js
}

//salvando tarefa
formTask.addEventListener('submit', (evento) => { //evento é o dado que será passado
    evento.preventDefault() //previne que os dados sejam perdidos
    if(tarefaEmEdicao){
        tarefaEmEdicao.descricao = textArea.value
        paragraphEmEdicao.textContent = textArea.value
    }else{
        const task = {
            descricao: textArea.value,
            concluida: false
        }
        tarefas.push(task) //adiciona no final
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem) //vai ser mostrado na nossa pagina
        }
    updateLocalStorage()
    limparForm()
})
//função que finaliza a tarefa
document.addEventListener('TarefaFinalizada',function (e) { //(e) é o parametro de evento
    if(tarefaSelecionada){
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled' , true)
        updateLocalStorage()
    }
})
//cancelando form 
cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden') 
})
btnCancelar.addEventListener('click', limparForm)

btnDeletar.addEventListener('click', () => {
    if(tarefaSelecionada){
        //achar posição da tarefa dentro da lista de tarefas
        const index = tarefas.indexOf(tarefaSelecionada)
        if(index !== -1){
            //se a tarefa existir, sera removida
            tarefas.splice(index,1)
        }
        itemTarefaSelecionada.remove()
        tarefas.filter(t=> t!= tarefaSelecionada) //criando um novo array sem a tarefa
        itemTarefaSelecionada = null
        tarefaSelecionada = null 
    }
    updateLocalStorage() // remove tarefa do localStorange
    limparForm() // limpa a area de escrever
})

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

deleteTarefaConcluida.addEventListener('click', () => removerTarefas(true))
deleteAllTask.addEventListener('click', () => removerTarefas(false))
