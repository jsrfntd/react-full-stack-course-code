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
        timers: [],
    };
//
//     1. Before initial render
//     React initializes the component. state is set to an object with the property timers, a blank
//     array, is returned.
//     2. The initial render
//     React then calls render() on TimersDashboard. In order for the render to complete, Editable-
//     TimerList and ToggleableTimerForm — its two children — must be rendered.
//     3. Children are rendered
//     EditableTimerList has its render method called. Because it was passed a blank data array, it
//     simply produces the following HTML output:
//          <div id='timers'>
//          </div>
//     ToggleableTimerForm renders its HTML, which is the “+” button.
//     4. Initial render is finished
//     With its children rendered, the initial render of TimersDashboard is finished and the HTML
//     is written to the DOM.
//     5. componentDidMount is invoked
//     Now that the component is mounted, componentDidMount() is called on TimersDashboard.
//     This method calls loadTimersFromServer(). In turn, that function calls client.getTimers().
//     That will make the HTTP request to our server, requesting the list of timers. When client
//     hears back, it invokes our success function.
//     On invocation, the success function is passed one argument, serverTimers. This is the array
//     of timers returned by the server. We then call setState(), which will trigger a new render.
//     The new render populates our app with EditableTimer children and all of their children. The
//     app is fully loaded and at an imperceptibly fast speed for the end user.
    componentDidMount(){
        this.loadTimerFromServer();
        setInterval(this.loadTimerFromServer,5000)
    }

    // client.getTimers() uses the Fetch API, which we cover in the next section. For our
    // purposes, the important thing to know is that when getTimers() is invoked, it fires off
    // the request to the server and then returns control flow immediately. The execution of our
    // program does not wait for the server’s response. This is why getTimers() is called an
    // asynchronous function.
    // The success function we pass to getTimers() is called a callback. We’re saying: “When
    // you finally hear back from the server, if it’s a successful response, invoke this function.”
    // This asynchronous paradigm ensures that execution of our JavaScript is not blocked by
    // I/O.
    loadTimerFromServer = () => {
        client.getTimers((serverTimers) => (
                this.setState({ timers: serverTimers })
            )
        );
    };

    startTimer = (timerId) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        runningSince: now,
                    });
                } else {
                    return timer;
                }
            }),
        });
        client.startTimer(
            { id: timerId, start: now }
        );
    };

    stopTimer = (timerId) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id === timerId){
                    const lastElapsed = now - timer.runningSince;
                    return Object.assign({}, timer , {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null,
                    })
                }else{
                    return timer;
                }
            })
        })

        client.stopTimer(
            { id: timerId, stop: now }
        );
    };

    //Esta función maneja el evento de creación de un timer
    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };


    //Función que implementa la creación de un timer
    //La separacion de esta funcion de la funcion handleCreateFormSubmit se hace debido al principio de Responsabilidad Unica
    createTimer = (timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        });
        client.createTimer(t)
    }


    //Esta función maneja el evento de edición de un timer
    handleEditFormSubmit = (timer) => {
        this.updateTimer(timer);
    };

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
        client.updateTimer(attrs);
    };

    //This function manages the delete event timer
    handleDeleteTimer = (idTimer) => {
        this.deleteTimer(idTimer);
    };

    deleteTimer = (idTimer) => {
        this.setState({
            timers: this.state.timers.filter(timer => timer.id !== idTimer)
        });
        client.deleteTimer({id:idTimer})
    };

    handleStartTimer = (idTimer) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id === idTimer){
                    return Object.assign({},timer, {
                        runningSince: now,
                    });
                }else{
                    return timer;
                }
            })
        });
        this.startTimer(idTimer);
    };

    handleStopTimer = (idTimer) => {
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map((timer) => {
                if(timer.id === idTimer){
                    const lastElapsed = now - timer.runningSince;
                    return Object.assign({},timer, {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null,
                    });
                }else{
                    return timer;
                }
            })
        });
        this.stopTimer(idTimer)
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
                        onTimerDelete={this.handleDeleteTimer}
                        onStartClick={this.handleStartTimer}
                        onStopClick={this.handleStopTimer}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
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
                    onFormSubmit={this.props.onFormSubmit}
                    onTimerDelete={this.props.onTimerDelete}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
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

    openForm = () => {
        this.setState({editFormOpen : true});
    };

    closeForm = () => {
        this.setState({editFormOpen : false});
    };

    handleSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.closeForm();
    };

    handleTimerDeleteClick = (idTimer) => {
        this.props.onTimerDelete(this.props.id)
    };

    handleStartClick = (idTimer) => {
        this.props.onStartClick(idTimer)
    };

    handleStopClick = (idTimer) => {
        this.props.onStopClick(idTimer)
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
                    onDeleteClick={this.handleTimerDeleteClick}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            );
        }
    }
}

class Timer extends React.Component {

// In componentDidMount(), we use the JavaScript function setInterval(). This will invoke the
// function forceUpdate() once every 50 ms, causing the component to re-render. We set the return
// of setInterval() to this.forceUpdateInterval.
// In componentWillUnmount(), we use clearInterval() to stop the interval this.forceUpdateInterval.
// componentWillUnmount() is called before a component is removed from the app. This will happen
// if a timer is deleted. We want to ensure we do not continue calling forceUpdate() after the timer
// has been removed from the page. React will throw errors.


    // setInterval() accepts two arguments. The first is the function you would like to call
    // repeatedly. The second is the interval on which to call that function (in milliseconds).
    // setInterval() returns a unique interval ID. You can pass this interval ID to
    // clearInterval() at any time to halt the interval.
    componentDidMount(){
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(),50);
    }

    componentWillUnmount(){
        clearInterval(this.forceUpdateInterval);
    }


    handleTimerDeleteClick = (idTimer) => {
        this.props.onDeleteClick(this.props.id)
    };

    handleStartClick = () => {
        this.props.onStartClick(this.props.id)
    };

    handleStopClick = () => {
        this.props.onStopClick(this.props.id)
    };

    render() {
        const elapsedString = helpers.renderElapsedString(
            this.props.elapsed, this.props.runningSince
        );
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
                              onClick={this.handleTimerDeleteClick}>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>
        );
    }
}


class TimerActionButton extends React.Component {
    render () {
        if(this.props.timerIsRunning){
            return (
                <div className='ui bottom attached red basic button' onClick={this.props.onStopClick}>
                    Stop
                </div>
            );
        }else{
            return (
                <div className='ui bottom attached green basic button' onClick={this.props.onStartClick}>
                    Start
                </div>
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


    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    };

    handleProjectChange = (e) => {
        this.setState({ project: e.target.value });
    };

    //Función que envia al padre las propiedades del elemento creado o modificado
    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        });
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input
                                type='text'
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input
                                type='text'
                                value={this.state.project}
                                onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button
                                className='ui basic blue button'
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>
                            <button
                                className='ui basic red button'
                                onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);