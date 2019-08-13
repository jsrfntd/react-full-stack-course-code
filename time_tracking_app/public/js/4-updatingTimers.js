/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/

/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/

//Componenete de mas alto grado en la jerarquia que de encarga de renderizar
//su respectivos componentes hijos. este componente es el responsable de los daors de los timers, es aqui
//donde se ha definido la lógica para manejar los eventos que se capturan de los componentes de menor jerarquia.
class TimersDashboard extends React.Component {

    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now()
            },
            {
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null,
            },
        ],
    };

    //Esta función maneja el evento de creación de un timer
    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    //Función que implementa la creación de un timer
    //La separacion de esta funcion de la funcion handleCreateFormSubmit se hace debido al principio de Responsabilidad Unica
    createTimer = (timer) => {
        const newTimer = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(newTimer),
        });
    }


    //Esta función maneja el evento de edición de un timer
    handleEditFormSubmit = (timer) => {
        this.updateTimer(timer);
    }

    updateTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === attrs.id) {
                    return Object.assign({}, timer, {
                        title: attrs.title,
                        project: attrs.project,
                    });
                } else {
                    return timer;
                }
            }),
        });
    };

    //Funcion de renderizado
    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    { /* Inside TimersDashboard.render() */}
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
                </div>
            </div>
        );
    }
}

//Lista de elementos editables
class EditableTimerList extends React.Component {
    render() {
        const timers = this.props.timers.map( (timer) => (
                <EditableTimer
                    key={timer.id}
                    id={timer.id}
                    title={timer.title}
                    project={timer.project}
                    elapsed={timer.elapsed}
                    runningSince={timer.runningSince}
                    onFormSubmit={this.props.onFormSubmit}
                />
            )
        );
        return (
            <div id='timers'>
                {timers}
            </div>
        );
    }
}

//This component manages the visualization logic on the timer and form components.
class EditableTimer extends React.Component{
    //Component's state
    state = {
        editFormOpen: false,
    };

    //This function manage the edition way of the component. Its passed by parameter to Timer component.
    handleEditClick = ()  => {
        this.openForm();
    };



    handleFormClose = () => {
        this.closeForm();
    };

    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.closeForm();
    };

    openForm = () => {
       this.setState({editFormOpen : true});
    };

    closeForm = () => {
        this.setState({editFormOpen : false});
    };


    render(){
        if(this.state.editFormOpen){
            return(
                <TimerForm
                    id = {this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        }else{
            return(
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.handleDeleteClick}
                />
            );
        }
    }
}

//Componente que maneja la logica de renderizado del boton inferior para agregar un
//elemento a la lista y el formulario de agregacion.
class ToggleableTimerForm extends React.Component{
    //Inicialización del estado del componente
    state = {
        isOpen: false,
    };

    //En esta forma react hace automaticamente el bind de la funcion de lo contrario la
    //notacion deberia ser la siguiente:
    // handleFormOpen() {
    //     this.setState({ isOpen: true });
    // }
    // constructor(props) {
    //     super(props);
    //     this.handleFormOpen = this.handleFormOpen.bind(this);
    // }

    //Funcion para modificar la variable que controla el renderizado del formulario
    handleFormOpen = () => {
        this.setState({isOpen: true});
    }

    //Funciones que se pasan como parámetro al componente TimerForm
    handleFormClose = () => {
        this.setState({isOpen: false});
    }

    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({isOpen: false})
    };

    //Renderizado del componente con base a un condicional controlado por la variable isOpen
    //El ciclo de llamado de las funciones es: onFormSubmit(TimerForm) - > handleFormSubmit (ToggleableTimerForm) ->
    //onFormSubmit (ToggleableTimerForm) -> handleCreateFormSubmit(TimerDashboard)
    render(){
        if(this.state.isOpen){
            return (
                <TimerForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        }else{
            return(
                <div className='ui basic content center aligned segment'>
                    <button className='ui basic button icon' onClick={this.handleFormOpen}>
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}


//Componente para la edicion de un timer
class TimerForm extends React.Component {

    //Inicializaxación del estado del componente
    state = {
        title: this.props.title || '',
        project: this.props.project || '',
    };

    //Función que envia al padre las propiedades del elemento creado o modificado
    handleSubmit = (e) => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        });
    };

    handleTitleChange = (e) => {
        this.setState({title: e.target.value})
    };

    handleProjectChange = (e) => {
        this.setState({project: e.target.value})
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text'
                                   value={this.state.title}
                                   onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text'
                                   value={this.state.project}
                                   onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button' onClick={this.handleSubmit}>
                                {submitText}
                            </button>
                            <button className='ui basic red button' onClick={this.props.onFormClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


class Timer extends React.Component {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
                        <span
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon'
                              onClick={this.props.onDeleteClick}>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    Start
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);