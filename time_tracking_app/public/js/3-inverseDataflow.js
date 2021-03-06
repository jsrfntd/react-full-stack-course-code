/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/

/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/

//It is the higher component in hierarchy which is reponsable to render his child components
// It load the timer's data and is here where we have already defined logic for managment events wich are captured
//from the minor herarchy components
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

    //Function that manages timer edition
    handleEditFormSubmit = (timer) => {

    }

    //"Timedashboard" render function.
    render(){
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                    />
                    <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit}/>
                </div>
            </div>
        );
    }
}

//Editable components list
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

//Componente que maneja la l'ogica de visualizacion tanto del timer como de
//su formulario de edicion
class EditableTimer extends React.Component{
    state = {
        editFormOpen: false,
    };
    render(){
        if(this.props.editFormOpen){
            return(
                <TimerForm
                    title={this.props.title}
                    project={this.props.project}
                />
            );
        }else{
            return(
                <Timer
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
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
                                   value={this.props.title}
                                   onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text'
                                   value={this.props.project}
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
                        <span className='right floated edit icon'>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon'>
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